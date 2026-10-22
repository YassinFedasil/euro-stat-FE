import { apiGet, apiPut } from "./api";

export type NumbersDoc = {
  _id: string; // "JJ-MM-AAAA"
  numbers: { number: string }[];
};

export type StarsDoc = {
  _id: string; // "JJ-MM-AAAA"
  stars: { star: string }[];
};

export type CombinationRecord = {
  index: number;
  numbers: number[];
  stars: number[];
};

export type SavedCombinationsDoc = {
  _id: string; // "JJ-MM-AAAA"
  combinations: CombinationRecord[];
  updated_at?: string | null;
};

export type SaveCombinationsResponse = {
  status: "success";
  message: string;
  _id: string;
  combinations: CombinationRecord[];
  updated_at?: string;
};

export const fetchNumbers = (date: string): Promise<NumbersDoc> =>
  apiGet<NumbersDoc>(`/api/numbers/${encodeURIComponent(date)}`);

export const fetchStars = (date: string): Promise<StarsDoc> =>
  apiGet<StarsDoc>(`/api/stars/${encodeURIComponent(date)}`);

export const fetchCombinations = (date: string): Promise<SavedCombinationsDoc> =>
  apiGet<SavedCombinationsDoc>(`/api/combinations/${encodeURIComponent(date)}`);

export const saveCombinations = (
  date: string,
  combinations: { numbers: number[]; stars: number[] }[],
): Promise<SaveCombinationsResponse> =>
  apiPut<SaveCombinationsResponse>(`/api/combinations/${encodeURIComponent(date)}`, {
    combinations,
  });
