import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../AuthContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { toast } from "sonner";
import { UserPlus, KeyRound, Trash2, Power, Pencil, X, Check } from "lucide-react";

interface StaffRow {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  is_active: boolean | null;
  last_login: string | null;
  created_at: string;
}

const StaffUsers = () => {
  usePageTitle("Staff Users — Wamuthondio Gas Admin");
  const { isOwner } = useAuth();
  const [rows, setRows] = useState<StaffRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [resetPwd, setResetPwd] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_users")
      .select("id,email,full_name,role,is_active,last_login,created_at")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as StaffRow[] | null) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const callFn = async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("manage-staff", { body });
    if (error) {
      const msg = (data as { error?: string } | null)?.error ?? error.message ?? "Request failed";
      throw new Error(msg);
    }
    if (data && (data as { error?: string }).error) {
      throw new Error((data as { error: string }).error);
    }
    return data;
  };

  // ----- Add new staff form -----
  const [addEmail, setAddEmail] = useState("");
  const [addName, setAddName] = useState("");
  const [addPwd, setAddPwd] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await callFn({
        action: "create",
        email: addEmail,
        full_name: addName,
        password: addPwd,
      });
      toast.success("Staff account created ✅");
      setAddEmail("");
      setAddName("");
      setAddPwd("");
      setShowAdd(false);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add staff");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (row: StaffRow) => {
    try {
      await callFn({ action: "set_active", id: row.id, is_active: !row.is_active });
      toast.success(row.is_active ? "Staff deactivated" : "Staff reactivated");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const saveName = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await callFn({ action: "update_name", id, full_name: editName.trim() });
      toast.success("Name updated");
      setEditingId(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update name");
    }
  };

  const submitReset = async (id: string) => {
    if (resetPwd.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    try {
      await callFn({ action: "reset_password", id, password: resetPwd });
      toast.success("Password reset ✅");
      setResettingId(null);
      setResetPwd("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reset password");
    }
  };

  const deleteStaff = async (row: StaffRow) => {
    if (!window.confirm(`Delete ${row.full_name || row.email}? This cannot be undone.`)) return;
    try {
      await callFn({ action: "delete", id: row.id });
      toast.success("Staff deleted");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  if (!isOwner) {
    return <div className="text-sm text-gray-600">You do not have access to this page.</div>;
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F1F3D]">Staff Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage staff accounts that can log into the admin panel.
          </p>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="inline-flex items-center gap-2 bg-[#E85D04] hover:bg-[#d35402] text-white font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          {showAdd ? "Close" : "Add Staff"}
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6 grid gap-4 md:grid-cols-3"
        >
          <div>
            <label className="block text-sm font-medium text-[#0F1F3D] mb-1">Full Name</label>
            <input
              required
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              placeholder="e.g. Jane Wanjiku"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F1F3D] mb-1">Email</label>
            <input
              required
              type="email"
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
              placeholder="staff@example.com"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F1F3D] mb-1">
              Initial Password
            </label>
            <input
              required
              type="text"
              minLength={8}
              value={addPwd}
              onChange={(e) => setAddPwd(e.target.value)}
              placeholder="Min 8 characters"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none"
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#0F1F3D] hover:bg-[#1a2f55] text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60"
            >
              {submitting ? "Creating…" : "Create Staff Account"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No accounts yet.
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map((row) => {
                  const isOwnerRow = row.role === "Owner";
                  const editing = editingId === row.id;
                  const resetting = resettingId === row.id;
                  return (
                    <tr key={row.id} className="hover:bg-gray-50/60">
                      <td className="px-4 py-3 font-medium text-[#0F1F3D]">
                        {editing ? (
                          <div className="flex items-center gap-2">
                            <input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="px-2 py-1 rounded border border-gray-300 text-sm"
                            />
                            <button
                              onClick={() => saveName(row.id)}
                              className="text-green-600 hover:text-green-700"
                              aria-label="Save"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-gray-500 hover:text-gray-700"
                              aria-label="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{row.full_name || "—"}</span>
                            {!isOwnerRow && (
                              <button
                                onClick={() => {
                                  setEditingId(row.id);
                                  setEditName(row.full_name ?? "");
                                }}
                                className="text-gray-400 hover:text-[#E85D04]"
                                aria-label="Edit name"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{row.email || "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            isOwnerRow
                              ? "bg-[#E85D04] text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {row.role ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            row.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {row.is_active ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {isOwnerRow ? (
                          <div className="text-right text-xs text-gray-400">Protected</div>
                        ) : resetting ? (
                          <div className="flex items-center gap-2 justify-end">
                            <input
                              type="text"
                              value={resetPwd}
                              onChange={(e) => setResetPwd(e.target.value)}
                              placeholder="New password"
                              className="px-2 py-1 rounded border border-gray-300 text-sm w-40"
                            />
                            <button
                              onClick={() => submitReset(row.id)}
                              className="px-2 py-1 rounded bg-[#0F1F3D] text-white text-xs"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setResettingId(null);
                                setResetPwd("");
                              }}
                              className="px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => toggleActive(row)}
                              title={row.is_active ? "Deactivate" : "Reactivate"}
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                                row.is_active
                                  ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                  : "bg-green-50 text-green-700 hover:bg-green-100"
                              }`}
                            >
                              <Power className="h-3.5 w-3.5" />
                              {row.is_active ? "Disable" : "Enable"}
                            </button>
                            <button
                              onClick={() => {
                                setResettingId(row.id);
                                setResetPwd("");
                              }}
                              title="Reset password"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                              <KeyRound className="h-3.5 w-3.5" />
                              Reset PW
                            </button>
                            <button
                              onClick={() => deleteStaff(row)}
                              title="Delete"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffUsers;
