import { useState, useEffect } from "react";
import { partnerApi } from "../services/partnerApi";
import { useSession } from "../../../lib/auth-client";
import type { TabType, HotelFormData, VehicleFormData, RoomType } from "../types/partner.types";

export function usePartnerDashboard() {
  const { data: session, isPending: sessionLoading } = useSession();
  const userRole = session?.user ? (session.user as any).role : null;

  // Workspace selection for admin
  const [activeWorkspace, setActiveWorkspace] = useState<"hotel" | "car">("hotel");

  // General States
  const [activeTab, setActiveTab] = useState<TabType>("hotels");
  const [hotels, setHotels] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editHotel, setEditHotel] = useState<any | null>(null);
  const [editVehicle, setEditVehicle] = useState<any | null>(null);

  // Hotel Form States
  const [hotelFormData, setHotelFormData] = useState<HotelFormData>({
    name: "",
    description: "",
    location: "",
    rating: 4,
    pricePerNight: 100,
    image: "",
    galleryRaw: "",
    amenitiesRaw: "",
    lat: 9.03,
    lng: 38.74,
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    cancellation: "Free cancellation up to 24 hours before check-in",
    roomTypes: [],
  });

  const [newRoom, setNewRoom] = useState<RoomType>({
    name: "",
    pricePerNight: 50,
    capacity: 2,
    image: "",
  });

  // Vehicle Form States
  const [vehicleFormData, setVehicleFormData] = useState<VehicleFormData>({
    name: "",
    type: "SUV",
    transmission: "Automatic",
    seats: 5,
    pricePerDay: 80,
    image: "",
    galleryRaw: "",
    description: "",
    featuresRaw: "",
    lat: 9.03,
    lng: 38.74,
    location: "",
  });

  // Auto-set tab based on role
  useEffect(() => {
    if (userRole === "hotel") {
      setActiveTab("hotels");
    } else if (userRole === "car") {
      setActiveTab("vehicles");
    }
  }, [userRole]);

  const fetchData = async () => {
    if (!userRole) return;
    setLoading(true);
    try {
      const isHotelView = userRole === "hotel" || (userRole === "admin" && activeWorkspace === "hotel");

      if (isHotelView) {
        const [hotelsData, bookingsData] = await Promise.all([
          partnerApi.getPartnerHotels().catch(() => []),
          partnerApi.getPartnerHotelReservations().catch(() => []),
        ]);
        setHotels(Array.isArray(hotelsData) ? hotelsData : []);
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } else {
        const [vehiclesData, bookingsData] = await Promise.all([
          partnerApi.getPartnerVehicles().catch(() => []),
          partnerApi.getPartnerVehicleReservations().catch(() => []),
        ]);
        setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setHotels([]);
      setVehicles([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userRole, activeWorkspace]);

  // Hotel Handlers
  const openAddHotelModal = () => {
    setEditHotel(null);
    setHotelFormData({
      name: "",
      description: "",
      location: "",
      rating: 4,
      pricePerNight: 100,
      image: "",
      galleryRaw: "",
      amenitiesRaw: "",
      lat: 9.03,
      lng: 38.74,
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 24 hours before check-in",
      roomTypes: [],
    });
    setIsHotelModalOpen(true);
  };

  const openEditHotelModal = (hotel: any) => {
    setEditHotel(hotel);
    setHotelFormData({
      name: hotel.name,
      description: hotel.description,
      location: hotel.location,
      rating: hotel.rating,
      pricePerNight: hotel.pricePerNight,
      image: hotel.image,
      galleryRaw: hotel.gallery ? hotel.gallery.join(", ") : "",
      amenitiesRaw: hotel.amenities ? hotel.amenities.join(", ") : "",
      lat: hotel.coordinates?.lat || 9.03,
      lng: hotel.coordinates?.lng || 38.74,
      checkIn: hotel.policies?.checkIn || "2:00 PM",
      checkOut: hotel.policies?.checkOut || "11:00 AM",
      cancellation: hotel.policies?.cancellation || "Free cancellation up to 24 hours before check-in",
      roomTypes: hotel.roomTypes || [],
    });
    setIsHotelModalOpen(true);
  };

  const handleHotelFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHotelFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoordinateChange = (lat: number, lng: number) => {
    setHotelFormData((prev) => ({ ...prev, lat, lng }));
  };

  const addRoomType = () => {
    if (!newRoom.name) return;
    setHotelFormData((prev) => ({
      ...prev,
      roomTypes: [...prev.roomTypes, newRoom],
    }));
    setNewRoom({ name: "", pricePerNight: 50, capacity: 2, image: "" });
  };

  const removeRoomType = (idx: number) => {
    setHotelFormData((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.filter((_, i) => i !== idx),
    }));
  };

  const handleHotelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amenities = hotelFormData.amenitiesRaw.split(",").map((s) => s.trim()).filter(Boolean);
    const gallery = hotelFormData.galleryRaw.split(",").map((s) => s.trim()).filter(Boolean);

    const payload = {
      name: hotelFormData.name,
      description: hotelFormData.description,
      location: hotelFormData.location,
      rating: Number(hotelFormData.rating),
      pricePerNight: Number(hotelFormData.pricePerNight),
      image: hotelFormData.image,
      gallery,
      amenities,
      coordinates: {
        lat: Number(hotelFormData.lat),
        lng: Number(hotelFormData.lng),
      },
      policies: {
        checkIn: hotelFormData.checkIn,
        checkOut: hotelFormData.checkOut,
        cancellation: hotelFormData.cancellation,
      },
      roomTypes: hotelFormData.roomTypes,
    };

    try {
      if (editHotel) {
        await partnerApi.updatePartnerHotel(editHotel._id, payload);
      } else {
        await partnerApi.createPartnerHotel(payload);
      }
      setIsHotelModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error saving hotel:", err);
      alert("Failed to save hotel listing.");
    }
  };

  const handleHotelDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this hotel property?")) return;
    try {
      await partnerApi.deletePartnerHotel(id);
      fetchData();
    } catch (err) {
      console.error("Error deleting hotel:", err);
      alert("Failed to delete hotel.");
    }
  };


  // Vehicle Handlers
  const openAddVehicleModal = () => {
    setEditVehicle(null);
    setVehicleFormData({
      name: "",
      type: "SUV",
      transmission: "Automatic",
      seats: 5,
      pricePerDay: 80,
      image: "",
      galleryRaw: "",
      description: "",
      providerName: "",
      providerPhone: "",
      featuresRaw: "",
      policyMileage: "Unlimited mileage included",
      policyFuel: "Full to Full",
      policyCancellation: "Free cancellation 24h prior",
    });
    setIsVehicleModalOpen(true);
  };

  const openEditVehicleModal = (vehicle: any) => {
    setEditVehicle(vehicle);
    setVehicleFormData({
      name: vehicle.name,
      type: vehicle.type,
      transmission: vehicle.transmission,
      seats: vehicle.seats,
      pricePerDay: vehicle.pricePerDay,
      image: vehicle.image,
      galleryRaw: vehicle.gallery ? vehicle.gallery.join(", ") : "",
      description: vehicle.description || "",
      providerName: vehicle.provider?.name || "",
      providerPhone: vehicle.provider?.phone || "",
      featuresRaw: vehicle.features ? vehicle.features.join(", ") : "",
      policyMileage: vehicle.policies?.mileage || "Unlimited mileage included",
      policyFuel: vehicle.policies?.fuel || "Full to Full",
      policyCancellation: vehicle.policies?.cancellation || "Free cancellation 24h prior",
    });
    setIsVehicleModalOpen(true);
  };

  const handleVehicleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setVehicleFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const features = vehicleFormData.featuresRaw.split(",").map((s) => s.trim()).filter(Boolean);
    const gallery = vehicleFormData.galleryRaw.split(",").map((s) => s.trim()).filter(Boolean);

    const payload = {
      name: vehicleFormData.name,
      type: vehicleFormData.type,
      transmission: vehicleFormData.transmission,
      seats: Number(vehicleFormData.seats),
      pricePerDay: Number(vehicleFormData.pricePerDay),
      image: vehicleFormData.image,
      gallery,
      description: vehicleFormData.description,
      provider: {
        name: vehicleFormData.providerName,
        rating: 5.0,
        phone: vehicleFormData.providerPhone,
      },
      features,
      policies: {
        mileage: vehicleFormData.policyMileage,
        fuel: vehicleFormData.policyFuel,
        cancellation: vehicleFormData.policyCancellation,
      },
      available: true,
    };

    try {
      if (editVehicle) {
        await partnerApi.updatePartnerVehicle(editVehicle._id, payload);
      } else {
        await partnerApi.createPartnerVehicle(payload);
      }
      setIsVehicleModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error saving vehicle:", err);
      alert("Failed to save vehicle listing.");
    }
  };

  const handleVehicleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this vehicle from your fleet?")) return;
    try {
      await partnerApi.deletePartnerVehicle(id);
      fetchData();
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      alert("Failed to delete vehicle.");
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: "Confirmed" | "Cancelled") => {
    if (!window.confirm(`Are you sure you want to mark this reservation as ${status}?`)) return;
    try {
      await partnerApi.updateReservationStatus(bookingId, status);
      fetchData();
    } catch (err) {
      console.error("Error updating booking status:", err);
      alert("Failed to update status.");
    }
  };


  return {
    session,
    sessionLoading,
    userRole,
    activeWorkspace,
    setActiveWorkspace,
    activeTab,
    setActiveTab,
    hotels,
    vehicles,
    bookings,
    loading,
    isHotelModalOpen,
    setIsHotelModalOpen,
    isVehicleModalOpen,
    setIsVehicleModalOpen,
    editHotel,
    editVehicle,
    hotelFormData,
    setHotelFormData,
    vehicleFormData,
    setVehicleFormData,
    newRoom,
    setNewRoom,
    openAddHotelModal,
    openEditHotelModal,
    handleHotelFormChange,
    handleCoordinateChange,
    addRoomType,
    removeRoomType,
    handleHotelSubmit,
    handleHotelDelete,
    openAddVehicleModal,
    openEditVehicleModal,
    handleVehicleFormChange,
    handleVehicleSubmit,
    handleVehicleDelete,
    handleUpdateBookingStatus,
    fetchData,
  };
}
