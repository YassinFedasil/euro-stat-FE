import { apiGet } from "./api";
import type { CombinationRecord } from "./euromillionsService";

export type HistoryListItem = {
  date: string; // "JJ-MM-AAAA"
  has_official: boolean;
  has_combinations: boolean;
};

export type HistoryList = {
  total: number;
  items: HistoryListItem[];
};

export type OfficialResult = {
  date: string;
  numbers: number[];
  stars: number[];
};

export type ComparedCombination = CombinationRecord & {
  matched_numbers: number | null;
  matched_stars: number | null;
  is_jackpot: boolean;
};

export type HistoryDraw = {
  date: string;
  official: OfficialResult | null;
  combinations: ComparedCombination[];
};

export const getHistory = (): Promise<HistoryList> =>
  apiGet<HistoryList>("/api/history");

export const getHistoryDraw = (date: string): Promise<HistoryDraw> =>
  apiGet<HistoryDraw>(`/api/history/${encodeURIComponent(date)}`);
