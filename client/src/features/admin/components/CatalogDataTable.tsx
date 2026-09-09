import { Landmark, MapPin, Star, Users, Edit3, Trash2, Loader2 } from "lucide-react";
import type { TabType } from "../types/admin.types";

interface CatalogDataTableProps {
  activeTab: TabType;
  items: any[];
  loading: boolean;
  onEdit: (item: any) => void;
  onDelete: (type: TabType, id: string) => void;
}

export function CatalogDataTable({
  activeTab,
  items,
  loading,
  onEdit,
  onDelete,
}: CatalogDataTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
        <h3 className="text-lg font-bold text-gray-900">Loading catalog items</h3>
        <p className="text-sm text-gray-500">Fetching records from server...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="p-4 bg-gray-100 rounded-full mb-4">
          <Landmark className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No items registered</h3>
        <p className="text-sm text-gray-500 max-w-sm">Get started by clicking the "Add New" button above.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-black text-gray-400 uppercase tracking-wider">
            <th className="py-4 px-6">Image</th>
            <th className="py-4 px-6">Details</th>
            <th className="py-4 px-6">Attributes</th>
            <th className="py-4 px-6">Pricing / Meta</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {items.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
              {/* Image */}
              <td className="py-4 px-6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-xl border border-gray-100 shadow-sm shrink-0"
                />
              </td>

              {/* Details */}
              <td className="py-4 px-6">
                <div className="font-bold text-gray-900 text-base">{item.name}</div>
                <div className="text-xs text-gray-500 flex items-center mt-1">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" /> {item.location || "N/A"}
                </div>
              </td>

              {/* Attributes */}
              <td className="py-4 px-6">
                {activeTab === "heritages" && (
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                      {item.category}
                    </span>
                    {item.isUnesco && (
                      <div className="text-xs text-amber-600 font-extrabold flex items-center mt-0.5">
                        ★ UNESCO Heritage
                      </div>
                    )}
                  </div>
                )}
                {activeTab === "cultures" && (
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">
                      Cultural
                    </span>
                  </div>
                )}
                {activeTab === "hotels" && (
                  <div className="space-y-1">
                    <div className="flex items-center text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 mr-1" /> {item.rating} Stars
                    </div>
                    <span className="text-xs text-gray-500 block">
                      {item.roomTypes?.length || 0} Room Types
                    </span>
                  </div>
                )}
                {activeTab === "vehicles" && (
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                      {item.type} ({item.transmission})
                    </span>
                    <div className="text-xs text-gray-500 flex items-center mt-0.5">
                      <Users className="w-3.5 h-3.5 mr-1" /> {item.seats} Seats
                    </div>
                  </div>
                )}
              </td>

              {/* Pricing / Meta */}
              <td className="py-4 px-6 font-semibold">
                {activeTab === "hotels" && (
                  <div>
                    <span className="text-xs text-gray-400 block font-normal">Starting Price</span>
                    <span className="text-green-700">
                      ${item.pricePerNight}{" "}
                      <span className="text-xs text-gray-500 font-normal">/ night</span>
                    </span>
                  </div>
                )}
                {activeTab === "vehicles" && (
                  <div>
                    <span className="text-xs text-gray-400 block font-normal">Daily Fee</span>
                    <span className="text-green-700">
                      ${item.pricePerDay}{" "}
                      <span className="text-xs text-gray-500 font-normal">/ day</span>
                    </span>
                  </div>
                )}
                {(activeTab === "heritages" || activeTab === "cultures") && (
                  <span className="text-gray-500 text-xs">Free / Open Catalog</span>
                )}
              </td>

              {/* Actions */}
              <td className="py-4 px-6 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(activeTab, item._id)}
                    className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
