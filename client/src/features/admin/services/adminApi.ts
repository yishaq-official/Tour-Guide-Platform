import { catalogApi } from "../../catalog/services/catalogApi";
import { servicesApi } from "../../services/services/servicesApi";

export const adminApi = {
  // Fetch all entities for admin table
  getDashboardData: async () => {
    const [heritages, cultures, hotels, vehicles] = await Promise.all([
      catalogApi.getHeritages(),
      catalogApi.getCultures(),
      servicesApi.getHotels(),
      servicesApi.getVehicles(),
    ]);
    return { heritages, cultures, hotels, vehicles };
  },

  // Delete entity by type and id
  deleteEntity: async (type: "heritages" | "cultures" | "hotels" | "vehicles", id: string) => {
    if (type === "heritages") return catalogApi.deleteHeritage(id);
    if (type === "cultures") return catalogApi.deleteCulture(id);
    if (type === "hotels") return servicesApi.deleteHotel(id);
    if (type === "vehicles") return servicesApi.deleteVehicle(id);
  },

  // Save entity (create or update)
  saveEntity: async (
    type: "heritages" | "cultures" | "hotels" | "vehicles",
    data: any,
    id?: string
  ) => {
    if (type === "heritages") {
      return id ? catalogApi.updateHeritage(id, data) : catalogApi.createHeritage(data);
    }
    if (type === "cultures") {
      return id ? catalogApi.updateCulture(id, data) : catalogApi.createCulture(data);
    }
    if (type === "hotels") {
      return id ? servicesApi.updateHotel(id, data) : servicesApi.createHotel(data);
    }
    if (type === "vehicles") {
      return id ? servicesApi.updateVehicle(id, data) : servicesApi.createVehicle(data);
    }
  },
};
