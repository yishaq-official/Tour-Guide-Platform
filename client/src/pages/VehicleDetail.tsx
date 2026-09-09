import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API_URL, apiFetch } from "../config";
import { useSession } from "../lib/auth-client";
import type { Vehicle } from "../features/services/types/service.types";
import { VehicleHeroGallery } from "../features/services/components/vehicle/VehicleHeroGallery";
import { VehicleFeatures } from "../features/services/components/vehicle/VehicleFeatures";
import { VehicleProviderCard } from "../features/services/components/vehicle/VehicleProviderCard";
import { VehicleSidebarBooking } from "../features/services/components/vehicle/VehicleSidebarBooking";
import { VehicleBookingModal } from "../features/bookings/components/VehicleBookingModal";

export function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    customerName: "",
    customerEmail: "",
    phone: "",
    guests: 1,
    pickupLocation: "",
    dropoffLocation: "",
    specialRequests: "",
  });

  useEffect(() => {
    if (session?.user) {
      setBookingData((prev) => ({
        ...prev,
        customerName: session.user.name || "",
        customerEmail: session.user.email || "",
      }));
    }
  }, [session]);

  const handleBookClick = () => {
    if (!session) {
      navigate("/login", { state: { from: `/services/vehicle/${id}` } });
      return;
    }
    setIsBookingModalOpen(true);
  };

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`${API_URL}/services/vehicles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch vehicle details");
        return res.json();
      })
      .then((data) => {
        setVehicle(data);
        if (data) {
          setBookingData((prev) => ({ ...prev, guests: data.seats || 1 }));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch vehicle details", err);
        setError("Failed to load vehicle details. Please check your connection and try again.");
        setLoading(false);
      });

    if (session) {
      apiFetch(`${API_URL}/user/favorites`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setIsFavorite(
              data.some((f: any) => (f.itemId && f.itemId._id === id) || f.itemId === id)
            );
          }
        })
        .catch(console.error);
    }
  }, [id, session]);

  const toggleFavorite = async () => {
    if (!session) return;
    setIsTogglingFavorite(true);
    try {
      const res = await apiFetch(`${API_URL}/user/favorites`, {
        method: "POST",
        body: JSON.stringify({
          itemId: id,
          itemModel: "Vehicle",
          userId: session?.user?.id || undefined,
        }),
      });
      if (res.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;

    setIsSubmitting(true);
    setBookingError("");

    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);

    if (end < start) {
      setBookingError("Drop-off date cannot be before pick-up date.");
      setIsSubmitting(false);
      return;
    }

    if (bookingData.guests < 1 || bookingData.guests > vehicle.seats) {
      setBookingError(`Number of passengers must be between 1 and ${vehicle.seats}.`);
      setIsSubmitting(false);
      return;
    }

    try {
      const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      const totalPrice = days * vehicle.pricePerDay;

      const response = await apiFetch(`${API_URL}/services/book`, {
        method: "POST",
        body: JSON.stringify({
          itemId: vehicle._id,
          itemModel: "Vehicle",
          customerName: bookingData.customerName,
          customerEmail: bookingData.customerEmail,
          phone: bookingData.phone,
          guests: bookingData.guests,
          pickupLocation: bookingData.pickupLocation,
          dropoffLocation: bookingData.dropoffLocation,
          specialRequests: bookingData.specialRequests,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          totalPrice,
          userId: session?.user?.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to create booking");

      setBookingSuccess(true);
    } catch (err) {
      console.error(err);
      setBookingError("An error occurred while confirming your reservation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="text-center py-32 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{error || "Vehicle not found"}</h2>
        <div className="mt-4">
          <Link to="/services" className="text-green-600 hover:underline text-lg">
            Return to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Showcase */}
      <VehicleHeroGallery
        vehicle={vehicle}
        session={session}
        isFavorite={isFavorite}
        isTogglingFavorite={isTogglingFavorite}
        onToggleFavorite={toggleFavorite}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Overview</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{vehicle.description}</p>
            </section>

            <VehicleFeatures features={vehicle.features} />

            <VehicleProviderCard provider={vehicle.provider} policies={vehicle.policies} />
          </div>

          <VehicleSidebarBooking
            pricePerDay={vehicle.pricePerDay}
            available={vehicle.available}
            onBookClick={handleBookClick}
          />
        </div>
      </div>

      {/* Booking Modal */}
      <VehicleBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        vehicle={vehicle}
        bookingData={bookingData}
        setBookingData={setBookingData}
        onSubmit={handleBookingSubmit}
        isSubmitting={isSubmitting}
        bookingSuccess={bookingSuccess}
        bookingError={bookingError}
      />
    </div>
  );
}
