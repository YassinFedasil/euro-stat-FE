import { apiDelete, apiGet, apiPost } from "./api";
import type { IDrawData } from "../types/drawData";

export type ExportDateResult = {
  date: string;
  reason?: string;
  message?: string;
};

export type ExportAllSummary = {
  status: "success" | "error";
  message?: string;
  total_found?: number;
  exported?: ExportDateResult[];
  skipped?: ExportDateResult[];
  ignored?: ExportDateResult[];
  errors?: ExportDateResult[];
  elapsed_ms?: number;
};

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

export const exportAllDrawsFromDrive = async (): Promise<ExportAllSummary> => {
  return await apiPost<ExportAllSummary>("/api/extract-drive-all", {});
};
