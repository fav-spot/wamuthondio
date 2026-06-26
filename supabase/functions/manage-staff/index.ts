// Owner-only staff management.
// Actions: "create" | "set_active" | "reset_password" | "delete" | "update_name"
// Authorization: caller must be authenticated and have admin_users.role = 'Owner' AND is_active = true.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Identify the caller
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return json({ error: "Missing Authorization header" }, 401);
    }

    const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userResult, error: userErr } = await callerClient.auth.getUser();
    if (userErr || !userResult.user) return json({ error: "Invalid session" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Verify caller is Owner
    const { data: callerRow } = await admin
      .from("admin_users")
      .select("role,is_active")
      .eq("id", userResult.user.id)
      .maybeSingle();
    if (!callerRow || !callerRow.is_active || callerRow.role !== "Owner") {
      return json({ error: "Forbidden: Owner only" }, 403);
    }

    const body = await req.json().catch(() => ({}));
    const action = String(body.action ?? "");

    if (action === "create") {
      const email = String(body.email ?? "").trim().toLowerCase();
      const fullName = String(body.full_name ?? "").trim();
      const password = String(body.password ?? "");
      if (!email || !fullName || password.length < 8) {
        return json({ error: "Email, full name, and password (min 8 chars) are required." }, 400);
      }

      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });
      if (createErr || !created.user) {
        return json({ error: createErr?.message ?? "Failed to create user" }, 400);
      }

      // Upsert admin_users row as Staff
      const { error: upsertErr } = await admin.from("admin_users").upsert({
        id: created.user.id,
        email,
        full_name: fullName,
        role: "Staff",
        is_active: true,
      });
      if (upsertErr) return json({ error: upsertErr.message }, 500);

      // Mirror to user_roles enum table (staff)
      await admin
        .from("user_roles")
        .insert({ user_id: created.user.id, role: "staff" })
        .then(() => null, () => null); // ignore duplicates

      return json({ success: true, id: created.user.id });
    }

    if (action === "set_active") {
      const id = String(body.id ?? "");
      const isActive = Boolean(body.is_active);
      if (!id) return json({ error: "id required" }, 400);

      // Prevent disabling another Owner via this endpoint
      const { data: target } = await admin
        .from("admin_users")
        .select("role")
        .eq("id", id)
        .maybeSingle();
      if (!target) return json({ error: "User not found" }, 404);
      if (target.role === "Owner") return json({ error: "Cannot modify an Owner account." }, 400);

      const { error } = await admin.from("admin_users").update({ is_active: isActive }).eq("id", id);
      if (error) return json({ error: error.message }, 500);

      // Optionally sign them out by banning if deactivating
      if (!isActive) {
        await admin.auth.admin.updateUserById(id, { ban_duration: "876000h" }); // ~100 years
      } else {
        await admin.auth.admin.updateUserById(id, { ban_duration: "none" });
      }

      return json({ success: true });
    }

    if (action === "reset_password") {
      const id = String(body.id ?? "");
      const password = String(body.password ?? "");
      if (!id || password.length < 8) return json({ error: "id and password (min 8 chars) required" }, 400);

      const { data: target } = await admin
        .from("admin_users")
        .select("role")
        .eq("id", id)
        .maybeSingle();
      if (!target) return json({ error: "User not found" }, 404);
      if (target.role === "Owner") return json({ error: "Cannot reset an Owner password here." }, 400);

      const { error } = await admin.auth.admin.updateUserById(id, { password });
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    if (action === "update_name") {
      const id = String(body.id ?? "");
      const fullName = String(body.full_name ?? "").trim();
      if (!id || !fullName) return json({ error: "id and full_name required" }, 400);

      const { data: target } = await admin
        .from("admin_users")
        .select("role")
        .eq("id", id)
        .maybeSingle();
      if (!target) return json({ error: "User not found" }, 404);
      if (target.role === "Owner") return json({ error: "Cannot modify an Owner here." }, 400);

      const { error } = await admin.from("admin_users").update({ full_name: fullName }).eq("id", id);
      if (error) return json({ error: error.message }, 500);
      await admin.auth.admin.updateUserById(id, { user_metadata: { full_name: fullName } });
      return json({ success: true });
    }

    if (action === "delete") {
      const id = String(body.id ?? "");
      if (!id) return json({ error: "id required" }, 400);

      const { data: target } = await admin
        .from("admin_users")
        .select("role")
        .eq("id", id)
        .maybeSingle();
      if (!target) return json({ error: "User not found" }, 404);
      if (target.role === "Owner") return json({ error: "Cannot delete an Owner account." }, 400);

      // Delete dependent rows first
      await admin.from("user_roles").delete().eq("user_id", id);
      await admin.from("admin_users").delete().eq("id", id);
      const { error } = await admin.auth.admin.deleteUser(id);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
