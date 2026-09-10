import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { SkeletonGrid } from "../../../../components/SkeletonCard";
import { useToast } from "../../../../context/ToastContext";
import { servicesApi } from "../../services/servicesApi";
import { bookingApi } from "../../../bookings/services/bookingApi";
import type { Hotel, Vehicle } from "../../types/service.types";
import { ServicesHero } from "./ServicesHero";
import { ServicesFilterBar, type SortOption } from "./ServicesFilterBar";
import { HotelCard } from "./HotelCard";
import { VehicleCard } from "./VehicleCard";
import {
  QuickBookingModal,
  type QuickBookingFormData,
} from "../../../bookings/components/QuickBookingModal";

export function ServicesExplorerView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") === "vehicles" ? "vehicles" : "hotels";

  const handleTabChange = (tab: "hotels" | "vehicles") => {
    setSearchParams({ tab }, { replace: true });
  };

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtering & Sorting States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [minRating, setMinRating] = useState<number>(0);

  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    item: Hotel | Vehicle | null;
    type: "hotel" | "vehicle";
  }>({ isOpen: false, item: null, type: "hotel" });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingFormData, setBookingFormData] = useState<QuickBookingFormData>({
    startDate: "",
    endDate: "",
    customerName: "",
    customerEmail: "",
  });

  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    setError("");
    const fetchServices = async () => {
      try {
        const [hotelsData, vehiclesData] = await Promise.all([
          servicesApi.getHotels(),
          servicesApi.getVehicles(),
        ]);

        setHotels(hotelsData);
        setVehicles(vehiclesData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch services", err);
        setError("Failed to load services. Please check your connection and try again.");
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModal.item) return;

    setIsSubmitting(true);
    setBookingError("");

    try {
      const isHotel = bookingModal.type === "hotel";
      const pricePerUnit = isHotel
        ? (bookingModal.item as Hotel).pricePerNight
        : (bookingModal.item as Vehicle).pricePerDay;

      const start = new Date(bookingFormData.startDate);
      const end = new Date(bookingFormData.endDate);
      const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      const totalPrice = days * pricePerUnit;

      await bookingApi.createBooking({
        itemId: bookingModal.item._id,
        itemModel: isHotel ? "Hotel" : "Vehicle",
        customerName: bookingFormData.customerName,
        customerEmail: bookingFormData.customerEmail,
        startDate: bookingFormData.startDate,
        endDate: bookingFormData.endDate,
        totalPrice,
      });

      setBookingSuccess(true);
      showToast("Reservation request submitted successfully!", "success", "Booking Confirmed");
    } catch (err) {
      console.error(err);
      setBookingError("An error occurred while confirming your reservation. Please try again.");
      showToast("Failed to confirm reservation", "error", "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredHotels = hotels
    .filter((h) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        h.name.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q);
      const matchesRating = minRating === 0 || h.rating >= minRating;
      return matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === "price_low") return a.pricePerNight - b.pricePerNight;
      if (sortBy === "price_high") return b.pricePerNight - a.pricePerNight;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const filteredVehicles = vehicles
    .filter((v) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q) ||
        v.transmission.toLowerCase().includes(q);
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price_low") return a.pricePerDay - b.pricePerDay;
      if (sortBy === "price_high") return b.pricePerDay - a.pricePerDay;
      return 0;
    });

  const resetFilters = () => {
    setSearchQuery("");
    setSortBy("featured");
    setMinRating(0);
  };

  const isFilteringActive = searchQuery !== "" || sortBy !== "featured" || minRating !== 0;

  return (
    <div className="w-full bg-gray-50/50 min-h-screen pb-24">
      {/* Hero Header */}
      <ServicesHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Controls Bar */}
        <ServicesFilterBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          minRating={minRating}
          onMinRatingChange={setMinRating}
          onReset={resetFilters}
          isFilteringActive={isFilteringActive}
        />

        {/* Content Area */}
        {loading ? (
          <SkeletonGrid count={6} />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : (activeTab === "hotels" ? filteredHotels : filteredVehicles).length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm max-w-lg mx-auto my-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 text-sm mb-6">
              We couldn't find any {activeTab === "hotels" ? "stays" : "vehicles"} matching your
              current search or filter criteria.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-green-700 text-white text-sm font-bold rounded-xl hover:bg-green-800 transition-colors shadow-md shadow-green-700/20"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTab === "hotels" &&
              filteredHotels.map((hotel, index) => (
                <HotelCard key={hotel._id} hotel={hotel} index={index} />
              ))}

            {activeTab === "vehicles" &&
              filteredVehicles.map((vehicle, index) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} index={index} />
              ))}
          </div>
        )}
      </div>

      {/* Quick Booking Modal */}
      <QuickBookingModal
        isOpen={bookingModal.isOpen}
        onClose={() => setBookingModal({ ...bookingModal, isOpen: false })}
        item={bookingModal.item}
        type={bookingModal.type}
        formData={bookingFormData}
        setFormData={setBookingFormData}
        onSubmit={handleBookingSubmit}
        isSubmitting={isSubmitting}
        bookingSuccess={bookingSuccess}
        bookingError={bookingError}
      />
    </div>
  );
}

export default ServicesExplorerView;
