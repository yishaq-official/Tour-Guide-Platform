import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import type { Hotel } from "../../services/types/service.types";

interface HotelBookingData {
  startDate: string;
  endDate: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  guests: number;
  roomType: string;
  specialRequests: string;
}

interface HotelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: Hotel;
  bookingData: HotelBookingData;
  setBookingData: React.Dispatch<React.SetStateAction<HotelBookingData>>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  bookingSuccess: boolean;
  bookingError: string;
}

export function HotelBookingModal({
  isOpen,
  onClose,
  hotel,
  bookingData,
  setBookingData,
  onSubmit,
  isSubmitting,
  bookingSuccess,
  bookingError,
}: HotelBookingModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
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
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h3 className="text-2xl font-bold text-gray-900">Complete Reservation</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 p-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              {bookingSuccess ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">Reservation Confirmed!</h3>
                  <p className="text-gray-600 text-lg mb-8">
                    Thank you, {bookingData.customerName}. Your {bookingData.roomType} at {hotel.name} is
                    confirmed. We've sent the details to {bookingData.customerEmail}.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Back to Hotel
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-6">
                  {bookingError && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm font-medium">
                      {bookingError}
                    </div>
                  )}

                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-4">Stay Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                        <select
                          required
                          value={bookingData.roomType}
                          onChange={(e) =>
                            setBookingData((prev) => ({ ...prev, roomType: e.target.value }))
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                        >
                          {hotel.roomTypes &&
                            hotel.roomTypes.map((rt, i) => (
                              <option key={i} value={rt.name}>
                                {rt.name} - ${rt.pricePerNight}/night
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="10"
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
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
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
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Late check-in, extra pillows, dietary requirements..."
                        value={bookingData.specialRequests}
                        onChange={(e) =>
                          setBookingData((prev) => ({ ...prev, specialRequests: e.target.value }))
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 mt-6 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-lg shadow-green-600/30"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white" />
                      ) : (
                        "Confirm & Pay at Hotel"
                      )}
                    </button>
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
