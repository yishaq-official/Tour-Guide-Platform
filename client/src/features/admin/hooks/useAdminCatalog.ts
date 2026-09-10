import { useState, useEffect } from "react";
import { adminApi } from "../services/adminApi";
import type { TabType, EditItemState } from "../types/admin.types";

export function useAdminCatalog() {
  const [activeTab, setActiveTab] = useState<TabType>("heritages");
  const [heritages, setHeritages] = useState<any[]>([]);
  const [cultures, setCultures] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States to trigger Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<EditItemState | null>(null);
  const [formData, setFormData] = useState<any>({});

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getDashboardData();
      setHeritages(data.heritages);
      setCultures(data.cultures);
      setHotels(data.hotels);
      setVehicles(data.vehicles);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleDelete = async (type: TabType, id: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) return;

    try {
      await adminApi.deleteEntity(type, id);
      if (type === "heritages") setHeritages((prev) => prev.filter((item) => item._id !== id));
      else if (type === "cultures") setCultures((prev) => prev.filter((item) => item._id !== id));
      else if (type === "hotels") setHotels((prev) => prev.filter((item) => item._id !== id));
      else if (type === "vehicles") setVehicles((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error occurred while deleting item.");
    }
  };


  const openAddModal = () => {
    let initial = {};
    if (activeTab === "heritages") {
      initial = {
        name: "",
        description: "",
        history: "",
        location: "",
        category: "Historical",
        isUnesco: false,
        coordinates: { lat: 9.03, lng: 38.74 },
        region: "",
        image: "",
        quickFacts: { established: "", type: "" },
        touristHighlights: [],
        travelerExperience: [],
      };
    } else if (activeTab === "cultures") {
      initial = {
        name: "",
        history: "",
        location: "",
        isUnesco: true,
        image: "",
        quickFacts: { established: "", type: "" },
        culturalHighlights: [],
        travelerExperience: [],
      };
    } else if (activeTab === "hotels") {
      initial = {
        name: "",
        description: "",
        location: "",
        rating: 5,
        pricePerNight: 100,
        image: "",
        amenities: "",
        coordinates: { lat: 9.03, lng: 38.74 },
        policies: { checkIn: "14:00", checkOut: "12:00", cancellation: "Free cancellation up to 24h" },
        roomTypes: [],
      };
    } else if (activeTab === "vehicles") {
      initial = {
        name: "",
        type: "SUV",
        transmission: "Automatic",
        seats: 5,
        pricePerDay: 50,
        image: "",
        description: "",
        provider: { name: "", rating: 5, phone: "" },
        features: "",
        policies: { mileage: "Unlimited", fuel: "Full to Full", cancellation: "Free cancellation" },
      };
    }
    setFormData(initial);
    setEditItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    const itemData = { ...item };
    if (activeTab === "hotels") {
      itemData.amenities = Array.isArray(item.amenities) ? item.amenities.join(", ") : item.amenities;
    } else if (activeTab === "vehicles") {
      itemData.features = Array.isArray(item.features) ? item.features.join(", ") : item.features;
    }
    setFormData(itemData);
    setEditItem({ type: activeTab, data: item });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { ...formData };
    if (activeTab === "hotels" && typeof payload.amenities === "string") {
      payload.amenities = payload.amenities.split(",").map((x: string) => x.trim()).filter(Boolean);
    } else if (activeTab === "vehicles" && typeof payload.features === "string") {
      payload.features = payload.features.split(",").map((x: string) => x.trim()).filter(Boolean);
    }

    const isEditing = Boolean(editItem);

    try {
      await adminApi.saveEntity(activeTab, payload, editItem?.data?._id);
      alert(`Successfully ${isEditing ? "updated" : "added"} item!`);
      setIsModalOpen(false);
      setEditItem(null);
      fetchAllData();
    } catch (err) {
      console.error(err);
      alert("Error saving item.");
    }
  };


  const getActiveList = () => {
    switch (activeTab) {
      case "heritages":
        return heritages;
      case "cultures":
        return cultures;
      case "hotels":
        return hotels;
      case "vehicles":
        return vehicles;
    }
  };

  return {
    activeTab,
    setActiveTab,
    heritages,
    cultures,
    hotels,
    vehicles,
    loading,
    isModalOpen,
    setIsModalOpen,
    editItem,
    formData,
    setFormData,
    handleDelete,
    openAddModal,
    openEditModal,
    handleSubmit,
    getActiveList,
  };
}
