import { apiGet } from "./api";

export type NumbersDoc = {
  _id: string; // "JJ-MM-AAAA"
  numbers: { number: string }[];
};

export type StarsDoc = {
  _id: string; // "JJ-MM-AAAA"
  stars: { star: string }[];
};

export const fetchNumbers = (date: string): Promise<NumbersDoc> =>
  apiGet<NumbersDoc>(`/api/numbers/${encodeURIComponent(date)}`);

export const fetchStars = (date: string): Promise<StarsDoc> =>
  apiGet<StarsDoc>(`/api/stars/${encodeURIComponent(date)}`);