import { apiGet } from "./api";

export async function fetchTopNumbers(top: number, last: number) {
  try {
    return await apiGet(`/api/charts/top?top=${top}&last=${last}`);
  } catch {
    throw new Error("Failed to fetch top charts");
  }
}

export async function fetchTopStars(top: number, last: number) {
  try {
    return await apiGet(`/api/charts/top-stars?top=${top}&last=${last}`);
  } catch {
    throw new Error("Erreur lors du chargement des stars");
  }
}
