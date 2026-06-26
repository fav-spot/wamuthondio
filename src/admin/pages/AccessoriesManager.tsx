import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Package, Edit2, Save, X } from "lucide-react";

export default function AccessoriesManager() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");

  const { data: accessories, isLoading } = useQuery({
    queryKey: ["admin_accessories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("accessories").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    retry: false,
  });

  const updatePriceMutation = useMutation({
    mutationFn: async ({ id, price }: { id: string; price: number }) => {
      const { error } = await supabase.from("accessories").update({ price }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_accessories"] });
      queryClient.invalidateQueries({ queryKey: ["accessories_pricing"] }); // refresh public side
      toast.success("Price updated successfully!");
      setEditingId(null);
    },
    onError: (err) => {
      toast.error("Failed to update price: " + err.message);
    },
  });

  const handleEditClick = (id: string, currentPrice: number) => {
    setEditingId(id);
    setEditPrice(currentPrice.toString());
  };

  const handleSave = (id: string) => {
    const price = parseFloat(editPrice);
    if (isNaN(price)) {
      toast.error("Please enter a valid price");
      return;
    }
    updatePriceMutation.mutate({ id, price });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#E85D04]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F1F3D]">Accessories Pricing</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the prices of your burners, grills, and regulators.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {accessories && accessories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Item Name</th>
                  <th className="px-6 py-4">Price (KSh)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {accessories.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#0F1F3D]">{item.item_name}</td>
                    <td className="px-6 py-4">
                      {editingId === item.id ? (
                        <input
                          type="number"
                          className="border border-[#E85D04] rounded-lg px-3 py-1.5 w-32 focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 font-bold text-[#E85D04]"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <span className="font-bold">KSh {item.price.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {editingId === item.id ? (
                        <>
                          <button
                            onClick={() => handleSave(item.id)}
                            disabled={updatePriceMutation.isPending}
                            className="p-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
                            title="Save"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEditClick(item.id, item.price)}
                          className="p-1.5 bg-[#FFB703]/10 text-[#E85D04] hover:bg-[#FFB703]/20 rounded-lg transition-colors"
                          title="Edit Price"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p>No accessories found. Please run the SQL script to initialize your database.</p>
          </div>
        )}
      </div>
    </div>
  );
}
