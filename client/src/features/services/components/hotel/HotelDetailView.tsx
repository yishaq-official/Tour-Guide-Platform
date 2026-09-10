import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapWidget } from "../../../../components/MapWidget";
import { useSession } from "../../../../lib/auth-client";
import { servicesApi } from "../../services/servicesApi";
import { bookingApi } from "../../../bookings/services/bookingApi";
import { itineraryApi } from "../../../itinerary/services/itineraryApi";
import type { Hotel } from "../../types/service.types";
import { HotelHeroGallery } from "./HotelHeroGallery";
import { HotelAmenities } from "./HotelAmenities";
import { HotelRoomTypes } from "./HotelRoomTypes";
import { HotelPoliciesCard } from "./HotelPoliciesCard";
import { RoomImageLightbox } from "./RoomImageLightbox";
import { HotelBookingModal } from "../../../bookings/components/HotelBookingModal";

export function HotelDetailView({ id }: { id?: string }) {
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
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
    roomType: "",
    specialRequests: "",
  });

  const [selectedRoomImage, setSelectedRoomImage] = useState<{ src: string; name: string } | null>(
    null
  );

  useEffect(() => {
    if (session?.user) {
      setBookingData((prev) => ({
        ...prev,
        customerName: session.user.name || "",
        customerEmail: session.user.email || "",
      }));
    }
  }, [session]);

  const handleBookClick = (roomName?: string) => {
    if (!session) {
      navigate("/login", { state: { from: `/services/hotel/${id}` } });
      return;
    }
    if (roomName) {
      setBookingData((prev) => ({ ...prev, roomType: roomName }));
    }
    setIsBookingModalOpen(true);
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");

    servicesApi
      .getHotelById(id)
      .then((data) => {
        setHotel(data);
        if (data.roomTypes && data.roomTypes.length > 0) {
          setBookingData((prev) => ({ ...prev, roomType: data.roomTypes[0].name }));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load hotel details. Please try again.");
        setLoading(false);
      });

    if (session) {
      itineraryApi
        .getFavorites()
        .then((data) => {
          if (Array.isArray(data)) {
            setIsFavorite(
              data.some((f: any) =>
                f.itemId && typeof f.itemId === "string" ? f.itemId === id : f.itemId?._id === id
              )
            );
          }
        })
        .catch(console.error);
    }
  }, [id, session]);

  const toggleFavorite = async () => {
    if (!session || !id) return;
    setIsTogglingFavorite(true);
    try {
      await itineraryApi.toggleFavorite(id, "Hotel");
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotel) return;

    setIsSubmitting(true);
    setBookingError("");

    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);

    if (end <= start) {
      setBookingError("Check-out date must be after check-in date.");
      setIsSubmitting(false);
      return;
    }

    if (bookingData.guests < 1) {
      setBookingError("Number of guests must be at least 1.");
      setIsSubmitting(false);
      return;
    }

    try {
      const selectedRoom =
        hotel.roomTypes.find((r) => r.name === bookingData.roomType) || hotel.roomTypes[0];
      const pricePerUnit = selectedRoom ? selectedRoom.pricePerNight : hotel.pricePerNight;

      const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      const totalPrice = days * pricePerUnit;

      await bookingApi.createBooking({
        itemId: hotel._id,
        itemModel: "Hotel",
        customerName: bookingData.customerName,
        customerEmail: bookingData.customerEmail,
        phone: bookingData.phone,
        guests: bookingData.guests,
        roomType: bookingData.roomType,
        specialRequests: bookingData.specialRequests,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalPrice,
        userId: session?.user?.id,
      });

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

  if (error || !hotel) {
    return (
      <div className="text-center py-32 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{error || "Hotel not found"}</h2>
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
      {/* Hero Gallery */}
      <HotelHeroGallery
        hotel={hotel}
        session={session}
        isFavorite={isFavorite}
        isTogglingFavorite={isTogglingFavorite}
        onToggleFavorite={toggleFavorite}
        onBookClick={() => handleBookClick()}
      />

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About this Hotel</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{hotel.description}</p>
            </section>

            <HotelAmenities amenities={hotel.amenities} />

            <HotelRoomTypes
              roomTypes={hotel.roomTypes}
              onSelectRoom={(roomName) => handleBookClick(roomName)}
              onViewImage={setSelectedRoomImage}
            />
          </div>

          <div className="space-y-8">
            <HotelPoliciesCard policies={hotel.policies} />

            <section className="h-80 rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
              <MapWidget
                name={hotel.name}
                lat={hotel.coordinates?.lat || 9.03}
                lng={hotel.coordinates?.lng || 38.74}
              />
            </section>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <HotelBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        hotel={hotel}
        bookingData={bookingData}
        setBookingData={setBookingData}
        onSubmit={handleBookingSubmit}
        isSubmitting={isSubmitting}
        bookingSuccess={bookingSuccess}
        bookingError={bookingError}
      />

      {/* Room Image Lightbox Modal */}
      <RoomImageLightbox
        selectedRoomImage={selectedRoomImage}
        onClose={() => setSelectedRoomImage(null)}
      />
    </div>
  );
}

export default HotelDetailView;
