import { X, Plus } from "lucide-react";
import type { TabType, EditItemState } from "../types/admin.types";
import { CoordinatesMapPicker } from "./CoordinatesMapPicker";

interface EntityEditorModalProps {
  isOpen: boolean;
  activeTab: TabType;
  editItem: EditItemState | null;
  formData: any;
  setFormData: (data: any) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EntityEditorModal({
  isOpen,
  activeTab,
  editItem,
  formData,
  setFormData,
  onClose,
  onSubmit,
}: EntityEditorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <h3 className="text-2xl font-bold text-gray-900">
            {editItem ? "Edit" : "Add New"} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 p-2 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={onSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Fields */}
            <div>
              <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                Name / Title
              </label>
              <input
                type="text"
                required
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                Location (Region/City)
              </label>
              <input
                type="text"
                required
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                Primary Image URL
              </label>
              <input
                type="url"
                required
                value={formData.image || ""}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold"
              />
            </div>

            {/* HERITAGE SPECIFIC FIELDS */}
            {activeTab === "heritages" && (
              <>
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category || "Historical"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold bg-white"
                  >
                    <option value="Historical">Historical</option>
                    <option value="Natural">Natural</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Archaeological">Archaeological</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Region
                  </label>
                  <input
                    type="text"
                    value={formData.region || ""}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    History & Background
                  </label>
                  <textarea
                    rows={3}
                    value={formData.history || ""}
                    onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Quick Facts - Established
                  </label>
                  <input
                    type="text"
                    value={formData.quickFacts?.established || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quickFacts: { ...formData.quickFacts, established: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Quick Facts - Type
                  </label>
                  <input
                    type="text"
                    value={formData.quickFacts?.type || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quickFacts: { ...formData.quickFacts, type: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isUnesco"
                    checked={formData.isUnesco || false}
                    onChange={(e) => setFormData({ ...formData, isUnesco: e.target.checked })}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="isUnesco" className="text-sm font-bold text-gray-700 cursor-pointer">
                    Official UNESCO Heritage Site
                  </label>
                </div>
              </>
            )}

            {/* CULTURE SPECIFIC FIELDS */}
            {activeTab === "cultures" && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    History & Significance
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.history || ""}
                    onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Quick Facts - Origin Period
                  </label>
                  <input
                    type="text"
                    value={formData.quickFacts?.established || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quickFacts: { ...formData.quickFacts, established: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Quick Facts - Main Type
                  </label>
                  <input
                    type="text"
                    value={formData.quickFacts?.type || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quickFacts: { ...formData.quickFacts, type: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isUnescoCulture"
                    checked={formData.isUnesco || false}
                    onChange={(e) => setFormData({ ...formData, isUnesco: e.target.checked })}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="isUnescoCulture" className="text-sm font-bold text-gray-700 cursor-pointer">
                    Official UNESCO Cultural heritage
                  </label>
                </div>
              </>
            )}

            {/* HOTEL SPECIFIC FIELDS */}
            {activeTab === "hotels" && (
              <>
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Rating (Stars)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    required
                    value={formData.rating || 5}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Starting Price per Night ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.pricePerNight || 100}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Amenities (Comma separated list)
                  </label>
                  <input
                    type="text"
                    placeholder="Free WiFi, Pool, Restaurant, Spa, Parking"
                    value={formData.amenities || ""}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Check-in Policy
                  </label>
                  <input
                    type="text"
                    value={formData.policies?.checkIn || "14:00"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        policies: { ...formData.policies, checkIn: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Check-out Policy
                  </label>
                  <input
                    type="text"
                    value={formData.policies?.checkOut || "12:00"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        policies: { ...formData.policies, checkOut: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Cancellation Policy
                  </label>
                  <input
                    type="text"
                    value={formData.policies?.cancellation || "Free cancellation"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        policies: { ...formData.policies, cancellation: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold"
                  />
                </div>
              </>
            )}

            {/* VEHICLE SPECIFIC FIELDS */}
            {activeTab === "vehicles" && (
              <>
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Transmission
                  </label>
                  <select
                    value={formData.transmission || "Automatic"}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold bg-white"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type || "SUV"}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold bg-white"
                  >
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Minivan">Minivan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Seats
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.seats || 5}
                    onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Daily Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.pricePerDay || 50}
                    onChange={(e) => setFormData({ ...formData, pricePerDay: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Features (Comma separated list)
                  </label>
                  <input
                    type="text"
                    placeholder="Air Conditioning, Bluetooth, GPS Navigation, 4WD"
                    value={formData.features || ""}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold"
                  />
                </div>

                {/* Provider */}
                <div className="md:col-span-2 border-t border-gray-100 pt-4">
                  <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-3">
                    Vehicle Provider Details
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Provider Name</label>
                      <input
                        type="text"
                        required
                        value={formData.provider?.name || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            provider: { ...formData.provider, name: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-xs font-semibold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Provider Rating</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        required
                        value={formData.provider?.rating || 5}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            provider: { ...formData.provider, rating: parseFloat(e.target.value) },
                          })
                        }
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-xs font-semibold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Provider Phone</label>
                      <input
                        type="text"
                        required
                        value={formData.provider?.phone || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            provider: { ...formData.provider, phone: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-xs font-semibold outline-none"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* COORDINATES SELECTOR MAP FOR HERITAGE / HOTELS */}
            {(activeTab === "heritages" || activeTab === "hotels") && (
              <div className="md:col-span-2 border-t border-gray-100 pt-4">
                <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  Location Coordinates
                </label>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-[10px] text-gray-400 block mb-1">Latitude</span>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.coordinates?.lat || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coordinates: { ...formData.coordinates, lat: parseFloat(e.target.value) },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block mb-1">Longitude</span>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.coordinates?.lng || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coordinates: { ...formData.coordinates, lng: parseFloat(e.target.value) },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none"
                    />
                  </div>
                </div>
                <CoordinatesMapPicker
                  lat={formData.coordinates?.lat}
                  lng={formData.coordinates?.lng}
                  onChange={(lat, lng) =>
                    setFormData({
                      ...formData,
                      coordinates: { lat, lng },
                    })
                  }
                />
              </div>
            )}

            {/* DYNAMIC SUB-ARRAYS MANAGER */}
            {(activeTab === "heritages" || activeTab === "cultures") && (
              <div className="md:col-span-2 border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                    Highlights Panel
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const arrKey = activeTab === "heritages" ? "touristHighlights" : "culturalHighlights";
                      const list = formData[arrKey] || [];
                      setFormData({ ...formData, [arrKey]: [...list, { title: "", description: "" }] });
                    }}
                    className="text-xs text-green-600 font-bold flex items-center gap-1 hover:text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200/50"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Highlight
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(
                    (activeTab === "heritages" ? formData.touristHighlights : formData.culturalHighlights) || []
                  ).map((hl: any, idx: number) => {
                    const arrKey = activeTab === "heritages" ? "touristHighlights" : "culturalHighlights";
                    return (
                      <div
                        key={idx}
                        className="p-4 bg-gray-50 rounded-2xl border border-gray-200 relative space-y-2"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            const list = [...formData[arrKey]];
                            list.splice(idx, 1);
                            setFormData({ ...formData, [arrKey]: list });
                          }}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xs"
                        >
                          Remove
                        </button>
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-1">Highlight Title</label>
                          <input
                            type="text"
                            placeholder="E.g., Obelisk of Axum"
                            required
                            value={hl.title || ""}
                            onChange={(e) => {
                              const list = [...formData[arrKey]];
                              list[idx].title = e.target.value;
                              setFormData({ ...formData, [arrKey]: list });
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-1">Description</label>
                          <textarea
                            placeholder="Brief detail..."
                            rows={2}
                            required
                            value={hl.description || ""}
                            onChange={(e) => {
                              const list = [...formData[arrKey]];
                              list[idx].description = e.target.value;
                              setFormData({ ...formData, [arrKey]: list });
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none resize-none"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ROOM TYPES MANAGER FOR HOTELS */}
            {activeTab === "hotels" && (
              <div className="md:col-span-2 border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider font-bold">
                    Room Types Management
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const list = formData.roomTypes || [];
                      setFormData({
                        ...formData,
                        roomTypes: [...list, { name: "", pricePerNight: 50, capacity: 2, image: "" }],
                      });
                    }}
                    className="text-xs text-green-600 font-bold flex items-center gap-1 hover:text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200/50"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Room Type
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(formData.roomTypes || []).map((room: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 rounded-2xl border border-gray-200 relative space-y-2"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const list = [...formData.roomTypes];
                          list.splice(idx, 1);
                          setFormData({ ...formData, roomTypes: list });
                        }}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xs"
                      >
                        Remove
                      </button>
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">Room Name</label>
                        <input
                          type="text"
                          placeholder="E.g., Deluxe Double Room"
                          required
                          value={room.name || ""}
                          onChange={(e) => {
                            const list = [...formData.roomTypes];
                            list[idx].name = e.target.value;
                            setFormData({ ...formData, roomTypes: list });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-1">Price per Night ($)</label>
                          <input
                            type="number"
                            required
                            value={room.pricePerNight}
                            onChange={(e) => {
                              const list = [...formData.roomTypes];
                              list[idx].pricePerNight = parseInt(e.target.value);
                              setFormData({ ...formData, roomTypes: list });
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-1">Max Guests</label>
                          <input
                            type="number"
                            required
                            value={room.capacity}
                            onChange={(e) => {
                              const list = [...formData.roomTypes];
                              list[idx].capacity = parseInt(e.target.value);
                              setFormData({ ...formData, roomTypes: list });
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">Room Image URL</label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={room.image || ""}
                          onChange={(e) => {
                            const list = [...formData.roomTypes];
                            list[idx].image = e.target.value;
                            setFormData({ ...formData, roomTypes: list });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-md shadow-green-600/10 text-center"
            >
              {editItem ? "Save Changes" : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
