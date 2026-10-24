import { apiGet } from "./api";

export type EngineSampling = "guided" | "uniform";

export type EngineNumberIndicator = {
  number: number;
  frequency: number | null;
  delay: number | null;
  recent_frequency: number | null;
  frequency_previous_period: number | null;
  probability: number;
};

export type EngineStarIndicator = {
  star: number;
  frequency: number | null;
  delay: number | null;
  recent_frequency: number | null;
  frequency_previous_period: number | null;
  probability: number;
};

export type EngineProfileDetail = {
  family: string;
  label: string;
  key: string;
  count: number;
  total: number;
  log_probability: number;
};

export type EngineAssociationDetail = {
  kind: "number_pair" | "star_pair" | "number_star";
  pair: number[];
  count: number;
  contribution: number;
};

export type EngineCombination = {
  numbers: number[];
  stars: number[];
  score: number;
  relative_score: number;
  rank: number;
  similarity: number;
  dimensions: {
    individual: number;
    profile: number;
    associations: number;
  };
  factors: {
    individual: number;
    profile: number;
    associations: number;
  };
  individuals: {
    numbers: {
      number: number;
      probability: number;
      log_probability: number;
      frequency: number | null;
      delay: number | null;
    }[];
    stars: {
      star: number;
      probability: number;
      log_probability: number;
      frequency: number | null;
      delay: number | null;
    }[];
  };
  profile: EngineProfileDetail[];
  associations: EngineAssociationDetail[];
  association_reliability: number;
};

export type EngineResponse = {
  date: string;
  seed: number;
  candidates: number;
  sampling: EngineSampling;
  elapsed_ms: number;
  source_mode: "cache" | "drive" | "fallback";
  history: {
    draws_used: number;
    first_date: string;
    last_date: string;
  };
  sources: {
    numbers_date: string;
    stars_date: string;
  };
  warnings: string[];
  indicators: {
    numbers: EngineNumberIndicator[];
    stars: EngineStarIndicator[];
  };
  combinations: EngineCombination[];
  selected_diversity: {
    threshold: number | null;
    mean_similarity: number;
    pairs: { a: number; b: number; similarity: number }[];
  };
  meta: {
    engine_version: string;
    confidence: string;
    windows: { recent: number; previous: number };
    probability_model: string;
    frequency_calibration: string;
    dimension_weights: Record<string, number>;
    active_dimensions: string[];
    profile_smoothing: string;
    profile_families: string[];
    association: Record<string, string | number>;
    score: string;
    relative_score: string;
    diversity: Record<string, string | number>;
    limitations: string[];
  };
};

export type EngineOptions = {
  seed?: number;
  candidates?: number;
  sampling?: EngineSampling;
};

export const fetchEngineCombinations = (
  date: string,
  options: EngineOptions = {},
): Promise<EngineResponse> => {
  const params = new URLSearchParams();
  if (options.seed !== undefined) params.set("seed", String(options.seed));
  if (options.candidates !== undefined) params.set("candidates", String(options.candidates));
  if (options.sampling) params.set("sampling", options.sampling);
  const query = params.toString();
  return apiGet<EngineResponse>(
    `/api/combination-engine/${encodeURIComponent(date)}${query ? `?${query}` : ""}`,
  );
};
