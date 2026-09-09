import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import type { Hotel, Vehicle } from "../../services/types/service.types";

export interface QuickBookingFormData {
  startDate: string;
  endDate: string;
  customerName: string;
  customerEmail: string;
}

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Hotel | Vehicle | null;
  type: "hotel" | "vehicle";
  formData: QuickBookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<QuickBookingFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  bookingSuccess: boolean;
  bookingError: string;
}

export function QuickBookingModal({
  isOpen,
  onClose,
  item,
  type,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  bookingSuccess,
  bookingError,
}: QuickBookingModalProps) {
  if (!isOpen || !item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden z-10"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">
              {type === "hotel" ? "Book Hotel" : "Rent Vehicle"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-bold text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-500">
                  {type === "hotel"
                    ? `$${(item as Hotel).pricePerNight} / night`
                    : `$${(item as Vehicle).pricePerDay} / day`}
                </p>
              </div>
            </div>

            {bookingSuccess ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Reservation Confirmed!</h3>
                <p className="text-gray-600">
                  Your booking was successfully processed. Check your email for details.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 w-full py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                {bookingError && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-4">
                    {bookingError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {type === "hotel" ? "Check-in" : "Pick-up"}
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {type === "hotel" ? "Check-out" : "Drop-off"}
                    </label>
                    <input
                      type="date"
                      required
                      min={formData.startDate}
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, customerName: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.customerEmail}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, customerEmail: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors mt-2 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                  ) : (
                    "Confirm Reservation"
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
