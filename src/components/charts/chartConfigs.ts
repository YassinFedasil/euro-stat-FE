export type ChartScope = "numbers" | "stars";
export type ChartMode = "aggregate" | "direct";
export type ChartVariant = "default" | "distributed";
export type SortMode = "numeric" | "localeFallback";
export type GuardMode = "falsy" | "nullish";

export interface ChartConfig {
  id: string;
  path: string;
  endpoint: string;
  dataKey: string;
  xAxisTitle: string;
  scope: ChartScope;
  mode?: ChartMode;
  variant?: ChartVariant;
  sortMode?: SortMode;
  guard?: GuardMode;
  metaTitle: string;
  metaDescription: string;
  breadcrumb: string;
  cardTitle: string;
  top10Title: string;
  top10Label: string;
  top10Uppercase?: boolean;
  top10Monospace?: boolean;
  top10Align?: "left" | "center";
  top10Truncate?: boolean;
}

export const CHARTS: ChartConfig[] = [
  {
    id: "out",
    path: "/bar-chart-out",
    endpoint: "chart-out",
    dataKey: "out_reduc",
    xAxisTitle: "Sorties",
    scope: "numbers",
    sortMode: "localeFallback",
    guard: "nullish",
    metaTitle: "Outs",
    metaDescription: "Outs Chart",
    breadcrumb: "Outs",
    cardTitle: "Bar Chart Out",
    top10Title: "Top 10 des sorties",
    top10Label: "Sortie",
  },
  {
    id: "out-range",
    path: "/bar-chart-out-range",
    endpoint: "chart-out-range",
    dataKey: "out_range",
    xAxisTitle: "Tranches de sorties",
    scope: "numbers",
    mode: "direct",
    metaTitle: "Outs Range",
    metaDescription: "Outs Range Chart",
    breadcrumb: "Outs Range",
    cardTitle: "Bar Chart Outs Range",
    top10Title: "Top 10 des combinaisons de sorties",
    top10Label: "Combinaison",
    top10Uppercase: true,
    top10Monospace: true,
    top10Truncate: true,
  },
  {
    id: "report",
    path: "/bar-chart-report",
    endpoint: "chart-report",
    dataKey: "report_reduc",
    xAxisTitle: "Rapports",
    scope: "numbers",
    sortMode: "localeFallback",
    metaTitle: "Report",
    metaDescription: "Report Chart",
    breadcrumb: "Report",
    cardTitle: "Bar Chart Report",
    top10Title: "Top 10 Rapports",
    top10Label: "Rapport",
  },
  {
    id: "delay",
    path: "/bar-chart-delay",
    endpoint: "chart-delay",
    dataKey: "delay",
    xAxisTitle: "Delays",
    scope: "numbers",
    metaTitle: "Delay",
    metaDescription: "Delay Chart",
    breadcrumb: "Delay",
    cardTitle: "Bar Chart Delay",
    top10Title: "Top 10 des retards",
    top10Label: "Retard",
    top10Uppercase: true,
    top10Align: "left",
  },
  {
    id: "delay-range",
    path: "/bar-chart-delay-range",
    endpoint: "chart-delay-range",
    dataKey: "delay_range",
    xAxisTitle: "Tranches des retards",
    scope: "numbers",
    mode: "direct",
    variant: "distributed",
    metaTitle: "Delay Range",
    metaDescription: "Delay Range Chart",
    breadcrumb: "Delay Range",
    cardTitle: "Bar Chart Delay Range",
    top10Title: "Top 10 des tranches de retard",
    top10Label: "Tranche",
    top10Uppercase: true,
    top10Align: "left",
  },
  {
    id: "frequency",
    path: "/bar-chart-frequency",
    endpoint: "chart-frequency",
    dataKey: "frequency",
    xAxisTitle: "Fréquences",
    scope: "numbers",
    metaTitle: "Frequency",
    metaDescription: "Frequency Chart",
    breadcrumb: "Frequency",
    cardTitle: "Bar Chart Frequency",
    top10Title: "Top 10 des fréquences",
    top10Label: "Fréquence",
  },
  {
    id: "frequency-previous-period",
    path: "/bar-chart-frequency-previous-period",
    endpoint: "chart-frequency-previous-period",
    dataKey: "frequency_previous_period",
    xAxisTitle: "Fréquence précédente périodique",
    scope: "numbers",
    metaTitle: "Frequency previous period",
    metaDescription: "Frequency previous period Chart",
    breadcrumb: "Frequency previous period",
    cardTitle: "Bar Chart Frequency previous period",
    top10Title: "Top 10 des fréquences (période précédente)",
    top10Label: "Fréq. Période Préc.",
  },
  {
    id: "progression",
    path: "/bar-chart-progression",
    endpoint: "chart-progression",
    dataKey: "progression",
    xAxisTitle: "Progression",
    scope: "numbers",
    metaTitle: "Progression",
    metaDescription: "Progression Chart",
    breadcrumb: "Progression",
    cardTitle: "Bar Chart Progression",
    top10Title: "Top 10 Progressions",
    top10Label: "Progression",
  },
  {
    id: "recent-frequency",
    path: "/bar-chart-recent-frequency",
    endpoint: "chart-recent-frequency",
    dataKey: "recent_frequency",
    xAxisTitle: "Fréquence récente",
    scope: "numbers",
    metaTitle: "RecentFrequency",
    metaDescription: "Recent Frequency Chart",
    breadcrumb: "Recent Frequency",
    cardTitle: "Bar Chart Recent Frequency",
    top10Title: "Top 10 Fréquences récentes",
    top10Label: "Fréquence récente",
  },
  {
    id: "delay-star",
    path: "/bar-chart-star-delay",
    endpoint: "chart-delay-star",
    dataKey: "delay",
    xAxisTitle: "Delays",
    scope: "stars",
    metaTitle: "Delay",
    metaDescription: "Delay Star Chart",
    breadcrumb: "Delay Star",
    cardTitle: "Bar Chart Delay",
    top10Title: "Top 10 Delays",
    top10Label: "Retard",
  },
  {
    id: "progression-star",
    path: "/bar-chart-star-progression",
    endpoint: "chart-progression-star",
    dataKey: "progression",
    xAxisTitle: "Progression",
    scope: "stars",
    metaTitle: "Progression",
    metaDescription: "Progression Chart",
    breadcrumb: "Progression Star",
    cardTitle: "Bar Chart Progression",
    top10Title: "Top 10 Progressions",
    top10Label: "Progression",
  },
  {
    id: "frequency-star",
    path: "/bar-chart-star-frequency",
    endpoint: "chart-frequency-star",
    dataKey: "frequency",
    xAxisTitle: "Fréquences",
    scope: "stars",
    metaTitle: "Frequency",
    metaDescription: "Frequency Chart",
    breadcrumb: "Frequency Star",
    cardTitle: "Bar Chart Frequency",
    top10Title: "Top 10 Fréquences",
    top10Label: "Fréquence",
  },
  {
    id: "frequency-previous-period-star",
    path: "/bar-chart-star-frequency-previous-period",
    endpoint: "chart-frequency-previous-period-star",
    dataKey: "frequency_previous_period",
    xAxisTitle: "Fréq. Période Préc",
    scope: "stars",
    metaTitle: "Frequency previous period",
    metaDescription: "Frequency previous period Chart",
    breadcrumb: "Frequency previous period Star",
    cardTitle: "Bar Chart Frequency previous period",
    top10Title: "Top 10 Fréquences Période Précédente",
    top10Label: "Fréquence Période Précédente",
  },
  {
    id: "recent-frequency-star",
    path: "/bar-chart-star-recent-frequency",
    endpoint: "chart-recent-frequency-star",
    dataKey: "recent_frequency",
    xAxisTitle: "Fréquence récente",
    scope: "stars",
    metaTitle: "RecentFrequency",
    metaDescription: "Recent Frequency Chart",
    breadcrumb: "Recent Frequency Star",
    cardTitle: "Bar Chart Recent Frequency",
    top10Title: "Top 10 Fréquences récentes",
    top10Label: "Fréquence récente",
  },
];

export const CHARTS_BY_ID: Record<string, ChartConfig> = Object.fromEntries(
  CHARTS.map((chart) => [chart.id, chart]),
);

export const NUMBER_CHARTS: ChartConfig[] = CHARTS.filter((chart) => chart.scope === "numbers");
export const STAR_CHARTS: ChartConfig[] = CHARTS.filter((chart) => chart.scope === "stars");

export const HOME_CHARTS_LEFT = [
  "out",
  "recent-frequency",
  "frequency",
];
export const HOME_CHARTS_RIGHT = [
  "report",
  "progression",
  "frequency-previous-period",
  "delay",
  "delay-range",
  "out-range",
];
export const STARS_CHARTS_LEFT = ["recent-frequency-star", "delay-star"];
export const STARS_CHARTS_RIGHT = [
  "progression-star",
  "frequency-previous-period-star",
  "frequency-star",
];
