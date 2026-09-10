import { api } from "../../../core/api/client";
import { ENDPOINTS } from "../../../core/api/endpoints";

export const catalogApi = {
  // Heritages
  getHeritages: () => api.get<any[]>(ENDPOINTS.HERITAGES),
  getHeritageById: (id: string) => api.get<any>(ENDPOINTS.HERITAGE_BY_ID(id)),
  createHeritage: (data: any) => api.post<any>(ENDPOINTS.HERITAGES, data),
  updateHeritage: (id: string, data: any) => api.put<any>(ENDPOINTS.HERITAGE_BY_ID(id), data),
  deleteHeritage: (id: string) => api.delete<any>(ENDPOINTS.HERITAGE_BY_ID(id)),

  // Cultures
  getCultures: () => api.get<any[]>(ENDPOINTS.CULTURES),
  getCultureById: (id: string) => api.get<any>(ENDPOINTS.CULTURE_BY_ID(id)),
  createCulture: (data: any) => api.post<any>(ENDPOINTS.CULTURES, data),
  updateCulture: (id: string, data: any) => api.put<any>(ENDPOINTS.CULTURE_BY_ID(id), data),
  deleteCulture: (id: string) => api.delete<any>(ENDPOINTS.CULTURE_BY_ID(id)),
};
