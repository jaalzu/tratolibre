"use client";

import { useState, useEffect } from "react";
import { Province } from "../types";
import { locationService } from "../services/location-service";

export function useProvinces() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    locationService
      .getProvinces()
      .then(setProvinces)
      .finally(() => setIsLoading(false));
  }, []);

  return { provinces, isLoading };
}
