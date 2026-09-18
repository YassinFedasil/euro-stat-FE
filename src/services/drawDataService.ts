import { apiDelete, apiGet } from "./api";
import type { IDrawData } from "../types/drawData";

export const getDrawData = async (): Promise<IDrawData[]> => {
  try {
    return await apiGet<IDrawData[]>("/api/draw-data");
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    throw error;
  }
};

export const deleteDrawData = async (id: string): Promise<void> => {
  await apiDelete(`/api/draw-data/${id}`);
};
