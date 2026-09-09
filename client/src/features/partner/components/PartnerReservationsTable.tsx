import { ClipboardList } from "lucide-react";

interface PartnerReservationsTableProps {
  isHotelView: boolean;
  bookings: any[];
  hotels: any[];
  vehicles: any[];
  accent: {
    bg: string;
    text: string;
  };
  onUpdateBookingStatus: (bookingId: string, status: "Confirmed" | "Cancelled") => void;
}

const panelClass =
  "rounded-[2rem] border border-white/10 bg-white/[0.92] shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function PartnerReservationsTable({
  isHotelView,
  bookings,
  hotels,
  vehicles,
  accent,
  onUpdateBookingStatus,
}: PartnerReservationsTableProps) {
  if (bookings.length === 0) {
    return (
      <div className={`${panelClass} p-12 text-center`}>
        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl ${accent.bg} ${accent.text}`}>
          <ClipboardList className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-black text-slate-950">No reservations yet</h3>
        <p className="mx-auto mt-3 max-w-md text-slate-500">
          {isHotelView
            ? "Reservations will appear here when travelers book rooms at your properties."
            : "Reservations will appear here when travelers rent vehicles from your fleet."}
        </p>
      </div>
    );
  }

  return (
    <div className={`${panelClass} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
              <th className="px-6 py-4">{isHotelView ? "Hotel / Room" : "Vehicle"}</th>
              <th className="px-6 py-4">Customer Details</th>
              <th className="px-6 py-4">Dates</th>
              <th className="px-6 py-4">{isHotelView ? "Guests" : "Days"}</th>
              <th className="px-6 py-4">Total Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {bookings.map((booking) => {
              const checkIn = booking.startDate ? new Date(booking.startDate).toLocaleDateString() : "";
              const checkOut = booking.endDate ? new Date(booking.endDate).toLocaleDateString() : "";
              const itemName = isHotelView
                ? hotels.find((h) => h._id === booking.itemId)?.name || "My Hotel"
                : vehicles.find((v) => v._id === booking.itemId)?.name || "My Vehicle";

              const statusClasses =
                booking.status === "Confirmed"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : booking.status === "Cancelled"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-amber-50 text-amber-700 border-amber-200";

              return (
                <tr key={booking._id} className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-5">
                    <div className="font-bold text-slate-950">{itemName}</div>
                    <div className="mt-0.5 text-xs text-slate-400">
                      {isHotelView ? booking.roomType || "Standard Room" : "Car Rental"}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-medium text-slate-900">{booking.customerName}</div>
                    <div className="text-xs text-slate-400">{booking.customerEmail}</div>
                    <div className="text-xs text-slate-400">{booking.phone}</div>
                  </td>
                  <td className="px-6 py-5 font-semibold text-slate-700">
                    {checkIn} - {checkOut}
                  </td>
                  <td className="px-6 py-5 font-medium text-slate-600">
                    {isHotelView ? `${booking.guests || 1} Guest(s)` : `${booking.days || 1} Day(s)`}
                  </td>
                  <td className="px-6 py-5 font-black text-emerald-700">{formatMoney(booking.totalPrice)}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${statusClasses}`}>
                      {booking.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {booking.status === "Pending" ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onUpdateBookingStatus(booking._id, "Confirmed")}
                          className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white shadow-sm transition hover:bg-emerald-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => onUpdateBookingStatus(booking._id, "Cancelled")}
                          className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-black text-rose-600 transition hover:bg-rose-100"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-slate-400">No actions</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
