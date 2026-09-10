import { useState } from "react";
import { bookingApi } from "../services/bookingApi";

export interface BookingFormData {
  customerName: string;
  customerEmail: string;
  phone: string;
  startDate: string;
  endDate: string;
  guests?: number;
  roomType?: string;
  specialRequests?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
}

export function useBookingForm(
  itemId: string,
  itemModel: "Hotel" | "Vehicle",
  priceUnit: number,
  userId?: string
) {
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: "",
    customerEmail: "",
    phone: "",
    startDate: "",
    endDate: "",
    guests: 1,
    roomType: "",
    specialRequests: "",
    pickupLocation: "",
    dropoffLocation: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 1;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const calculateTotal = () => {
    return calculateDays() * priceUnit;
  };

  const submitBooking = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await bookingApi.createBooking({
        ...formData,
        itemId,
        itemModel,
        totalPrice: calculateTotal(),
        userId,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSuccess(false);
    setError(null);
  };

  return {
    formData,
    setFormData,
    submitting,
    success,
    error,
    calculateDays,
    calculateTotal,
    submitBooking,
    reset,
  };
}
