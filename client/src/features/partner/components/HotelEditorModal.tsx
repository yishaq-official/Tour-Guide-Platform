import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Users, Plus, Trash2 } from "lucide-react";
import type { HotelFormData, RoomType } from "../types/partner.types";
import { CoordinatesMapPicker } from "../../../shared/components/map/CoordinatesMapPicker";

interface HotelEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  editHotel: any | null;
  formData: HotelFormData;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCoordinateChange: (lat: number, lng: number) => void;
  newRoom: RoomType;
  setNewRoom: React.Dispatch<React.SetStateAction<RoomType>>;
  onAddRoomType: () => void;
  onRemoveRoomType: (idx: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  accentButton?: string;
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-0";
const textAreaClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-0";

export function HotelEditorModal({
  isOpen,
  onClose,
  editHotel,
  formData,
  onFormChange,
  onCoordinateChange,
  newRoom,
  setNewRoom,
  onAddRoomType,
  onRemoveRoomType,
  onSubmit,
  accentButton = "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20",
}: HotelEditorModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-md"
        >
          <div className="mx-auto my-8 w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-8">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-500">
                  Hotel Listing
                </div>
                <h3 className="mt-1 text-2xl font-black text-slate-950">
                  {editHotel ? "Edit Hotel Listing" : "Register a New Hotel"}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="max-h-[80vh] overflow-y-auto p-6 sm:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Hotel Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={onFormChange}
                    className={inputClass}
                    placeholder="Grand Ethiopian Hotel"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Location / City</label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={onFormChange}
                    className={inputClass}
                    placeholder="Addis Ababa, Ethiopia"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-bold text-slate-700">Description</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={onFormChange}
                  className={textAreaClass}
                  placeholder="A brief description detailing the experiences and amenities..."
                />
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Starting Price per Night ($)</label>
                  <input
                    type="number"
                    name="pricePerNight"
                    required
                    value={formData.pricePerNight}
                    onChange={onFormChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Hotel Rating (1-5)</label>
                  <input
                    type="number"
                    name="rating"
                    min="1"
                    max="5"
                    step="0.1"
                    required
                    value={formData.rating}
                    onChange={onFormChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Main Cover Image URL</label>
                  <input
                    type="url"
                    name="image"
                    required
                    value={formData.image}
                    onChange={onFormChange}
                    className={inputClass}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Amenities (comma-separated)</label>
                  <input
                    type="text"
                    name="amenitiesRaw"
                    value={formData.amenitiesRaw}
                    onChange={onFormChange}
                    className={inputClass}
                    placeholder="Free Wi-Fi, Pool, Restaurant, Spa, Free Parking"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Gallery Image URLs (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="galleryRaw"
                    value={formData.galleryRaw}
                    onChange={onFormChange}
                    className={inputClass}
                    placeholder="https://url1.com, https://url2.com"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Hotel Location Coordinates: ({formData.lat.toFixed(5)}, {formData.lng.toFixed(5)})
                </label>
                <CoordinatesMapPicker
                  lat={formData.lat}
                  lng={formData.lng}
                  onChange={onCoordinateChange}
                  className="w-full h-72 rounded-[1.75rem] overflow-hidden border border-slate-200 shadow-[0_18px_50px_rgba(15,23,42,0.14)] relative z-10"
                  badgeText="CLICK TO PLACE COORDINATES"
                />
              </div>

              <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-slate-700">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  Hotel Policies
                </h4>
                <div className="mt-5 grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Check-In Time
                    </label>
                    <input
                      type="text"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={onFormChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Check-Out Time
                    </label>
                    <input
                      type="text"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={onFormChange}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Cancellation Policy
                  </label>
                  <input
                    type="text"
                    name="cancellation"
                    value={formData.cancellation}
                    onChange={onFormChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-slate-700">
                  <Users className="h-4 w-4 text-emerald-600" />
                  Room Configurations ({formData.roomTypes?.length || 0})
                </h4>

                {formData.roomTypes?.length > 0 && (
                  <div className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    {formData.roomTypes.map((room, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-4 p-4">
                        <div className="flex items-center gap-4">
                          {room.image && (
                            <img src={room.image} alt={room.name} className="h-12 w-12 rounded-xl object-cover" />
                          )}
                          <div>
                            <div className="font-bold text-slate-950">{room.name}</div>
                            <div className="text-xs text-slate-400">
                              Up to {room.capacity} guests • ${room.pricePerNight}/night
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveRoomType(idx)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="grid gap-4 lg:grid-cols-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        Room Name
                      </label>
                      <input
                        type="text"
                        value={newRoom.name}
                        onChange={(e) => setNewRoom((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Deluxe Suite"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        Guests Capacity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newRoom.capacity}
                        onChange={(e) => setNewRoom((prev) => ({ ...prev, capacity: Number(e.target.value) }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        Nightly Price ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newRoom.pricePerNight}
                        onChange={(e) => setNewRoom((prev) => ({ ...prev, pricePerNight: Number(e.target.value) }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        Room Cover URL
                      </label>
                      <input
                        type="url"
                        value={newRoom.image}
                        onChange={(e) => setNewRoom((prev) => ({ ...prev, image: e.target.value }))}
                        placeholder="https://..."
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onAddRoomType}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white transition hover:bg-slate-800"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Room Option
                  </button>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-slate-200 px-6 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`rounded-full px-6 py-3 text-sm font-black text-white shadow-lg ${accentButton}`}
                >
                  {editHotel ? "Save Changes" : "Register Hotel"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
