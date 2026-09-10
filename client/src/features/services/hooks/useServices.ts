import { useState, useEffect, useCallback } from "react";
import { servicesApi } from "../services/servicesApi";

export function useServices() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [hotelsData, vehiclesData] = await Promise.all([
        servicesApi.getHotels(),
        servicesApi.getVehicles(),
      ]);
      setHotels(hotelsData);
      setVehicles(vehiclesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  return {
    hotels,
    vehicles,
    loading,
    error,
    reload: loadServices,
  };
}
