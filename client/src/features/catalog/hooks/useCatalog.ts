import { useState, useEffect, useCallback } from "react";
import { catalogApi } from "../services/catalogApi";

export function useCatalog() {
  const [heritages, setHeritages] = useState<any[]>([]);
  const [cultures, setCultures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [heritagesData, culturesData] = await Promise.all([
        catalogApi.getHeritages(),
        catalogApi.getCultures(),
      ]);
      setHeritages(heritagesData);
      setCultures(culturesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load catalog");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  return {
    heritages,
    cultures,
    loading,
    error,
    reload: loadCatalog,
  };
}
