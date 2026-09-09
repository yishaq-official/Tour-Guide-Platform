import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Clock } from "lucide-react";
import type { VehicleFormData } from "../types/partner.types";

interface VehicleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  editVehicle: any | null;
  formData: VehicleFormData;
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-sky-500/30 focus:ring-offset-0";
const textAreaClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-sky-500/30 focus:ring-offset-0";

export function VehicleEditorModal({
  isOpen,
  onClose,
  editVehicle,
  formData,
  onFormChange,
  onSubmit,
}: VehicleEditorModalProps) {
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
                <div className="text-[11px] font-black uppercase tracking-[0.24em] text-sky-500">
                  Vehicle Listing
                </div>
                <h3 className="mt-1 text-2xl font-black text-slate-950">
                  {editVehicle ? "Edit Vehicle Listing" : "List a New Vehicle"}
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
                  <label className="mb-2 block text-sm font-bold text-slate-700">Vehicle Name / Model</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={onFormChange}
                    className={inputClass}
                    placeholder="Toyota Land Cruiser"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Body Type</label>
                    <select name="type" value={formData.type} onChange={onFormChange} className={inputClass}>
                      <option value="SUV">SUV</option>
                      <option value="Sedan">Sedan</option>
                      <option value="Minivan">Minivan</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Transmission</label>
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={onFormChange}
                      className={inputClass}
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-bold text-slate-700">Vehicle Description</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={onFormChange}
                  className={textAreaClass}
                  placeholder="Describe the condition, details, and features of the vehicle..."
                />
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Daily Rental Price ($)</label>
                  <input
                    type="number"
                    name="pricePerDay"
                    required
                    value={formData.pricePerDay}
                    onChange={onFormChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Seats Capacity</label>
                  <input
                    type="number"
                    name="seats"
                    required
                    value={formData.seats}
                    onChange={onFormChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Cover Image URL</label>
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
                  <label className="mb-2 block text-sm font-bold text-slate-700">Features (comma-separated)</label>
                  <input
                    type="text"
                    name="featuresRaw"
                    value={formData.featuresRaw}
                    onChange={onFormChange}
                    className={inputClass}
                    placeholder="A/C, Bluetooth, Backup Camera, Leather Seats, 4WD"
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
                    placeholder="https://img1.jpg, https://img2.jpg"
                  />
                </div>
              </div>

              <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-slate-700">
                  <ShieldCheck className="h-4 w-4 text-sky-600" />
                  Provider Profile
                </h4>
                <div className="mt-5 grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Company / Owner Name
                    </label>
                    <input
                      type="text"
                      name="providerName"
                      required
                      value={formData.providerName}
                      onChange={onFormChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Provider Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="providerPhone"
                      required
                      value={formData.providerPhone}
                      onChange={onFormChange}
                      className={inputClass}
                      placeholder="+251-9..."
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-slate-700">
                  <Clock className="h-4 w-4 text-sky-600" />
                  Rental Policies
                </h4>
                <div className="mt-5 grid gap-6 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Mileage Policy
                    </label>
                    <input
                      type="text"
                      name="policyMileage"
                      value={formData.policyMileage}
                      onChange={onFormChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Fuel Guidelines
                    </label>
                    <input
                      type="text"
                      name="policyFuel"
                      value={formData.policyFuel}
                      onChange={onFormChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Cancellation Policy
                    </label>
                    <input
                      type="text"
                      name="policyCancellation"
                      value={formData.policyCancellation}
                      onChange={onFormChange}
                      className={inputClass}
                    />
                  </div>
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
                  className="rounded-full bg-sky-600 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:bg-sky-700"
                >
                  {editVehicle ? "Save Changes" : "List Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
