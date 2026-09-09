import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import type { Vehicle } from "../../services/types/service.types";

interface VehicleBookingData {
  startDate: string;
  endDate: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  guests: number;
  pickupLocation: string;
  dropoffLocation: string;
  specialRequests: string;
}

interface VehicleBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  bookingData: VehicleBookingData;
  setBookingData: React.Dispatch<React.SetStateAction<VehicleBookingData>>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  bookingSuccess: boolean;
  bookingError: string;
}

export function VehicleBookingModal({
  isOpen,
  onClose,
  vehicle,
  bookingData,
  setBookingData,
  onSubmit,
  isSubmitting,
  bookingSuccess,
  bookingError,
}: VehicleBookingModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0 bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-16 object-contain mix-blend-multiply"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Book {vehicle.name}</h3>
                  <p className="text-sm text-gray-500">${vehicle.pricePerDay} / day</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors bg-white border border-gray-200 p-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
              {bookingSuccess ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">Rental Confirmed!</h3>
                  <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                    Thank you, {bookingData.customerName}. Your reservation for the {vehicle.name} is confirmed.
                    Details have been sent to {bookingData.customerEmail}.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Close Window
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-8">
                  {bookingError && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm font-medium">
                      {bookingError}
                    </div>
                  )}

                  {/* Dates & Locations */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative">
                    <div className="absolute top-0 left-6 -translate-y-1/2 bg-white px-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                      Itinerary
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Pick-up Date</label>
                          <input
                            type="date"
                            required
                            value={bookingData.startDate}
                            onChange={(e) =>
                              setBookingData((prev) => ({ ...prev, startDate: e.target.value }))
                            }
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Pick-up Location</label>
                          <select
                            required
                            value={bookingData.pickupLocation}
                            onChange={(e) =>
                              setBookingData((prev) => ({ ...prev, pickupLocation: e.target.value }))
                            }
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                          >
                            <option value="" disabled>
                              Select location
                            </option>
                            <option value="Bole International Airport">Bole International Airport (ADD)</option>
                            <option value="City Center Office">City Center Office, Addis Ababa</option>
                            <option value="Custom Location">Custom Hotel Drop-off (Add to requests)</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Drop-off Date</label>
                          <input
                            type="date"
                            required
                            min={bookingData.startDate}
                            value={bookingData.endDate}
                            onChange={(e) =>
                              setBookingData((prev) => ({ ...prev, endDate: e.target.value }))
                            }
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Drop-off Location</label>
                          <select
                            required
                            value={bookingData.dropoffLocation}
                            onChange={(e) =>
                              setBookingData((prev) => ({ ...prev, dropoffLocation: e.target.value }))
                            }
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                          >
                            <option value="" disabled>
                              Select location
                            </option>
                            <option value="Bole International Airport">Bole International Airport (ADD)</option>
                            <option value="City Center Office">City Center Office, Addis Ababa</option>
                            <option value="Custom Location">Custom Location (Add to requests)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Driver Details */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative">
                    <div className="absolute top-0 left-6 -translate-y-1/2 bg-white px-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                      Driver Details
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="John Doe"
                          value={bookingData.customerName}
                          onChange={(e) =>
                            setBookingData((prev) => ({ ...prev, customerName: e.target.value }))
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="+251 911 234 567"
                          value={bookingData.phone}
                          onChange={(e) =>
                            setBookingData((prev) => ({ ...prev, phone: e.target.value }))
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="john@example.com"
                          value={bookingData.customerEmail}
                          onChange={(e) =>
                            setBookingData((prev) => ({ ...prev, customerEmail: e.target.value }))
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Passengers</label>
                        <input
                          type="number"
                          required
                          min={1}
                          max={vehicle.seats}
                          value={bookingData.guests}
                          onChange={(e) =>
                            setBookingData((prev) => ({
                              ...prev,
                              guests: parseInt(e.target.value) || 1,
                            }))
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Special Requests (Optional)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Child seat needed, exact drop-off hotel address..."
                          value={bookingData.specialRequests}
                          onChange={(e) =>
                            setBookingData((prev) => ({ ...prev, specialRequests: e.target.value }))
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-lg shadow-green-600/30"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white" />
                      ) : (
                        "Confirm Reservation"
                      )}
                    </button>
                    <p className="text-center text-gray-500 text-sm mt-4 font-medium">
                      You won't be charged until pick-up.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
