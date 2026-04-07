// features/search/services/location-service.ts
import { Province } from "../types";

const GEOREF_API = "https://apis.datos.gob.ar/georef/api";

export const locationService = {
  getProvinces: async (): Promise<Province[]> => {
    try {
      const response = await fetch(
        `${GEOREF_API}/provincias?orden=nombre&campos=id,nombre&max=100`,
      );

      if (!response.ok) throw new Error("Error fetching provinces");

      const data = await response.json();

      // Retornamos la data tipada para que el hook sepa qué recibe
      return data.provincias ?? [];
    } catch (error) {
      console.error("LocationService Error:", error);
      return [];
    }
  },
};
