export interface INumbersData {
  number: string;
  frequency: string;
  delay: string;
  progression: string;
  recent_frequency: string;
  frequency_previous_period: string;
  last_out: string;
  out_reduc: string;
  report_reduc: string;
}

export interface IStarsData {
  star: string;
  frequency: string;
  delay: string;
  progression: string;
  recent_frequency: string;
  frequency_previous_period: string;
  last_out: string;
}

export interface IMostLeastPlayed {
  least_played_numbers: string;
  most_played_numbers: string;
  least_played_stars: string;
  most_played_stars: string;
}

export interface IDrawData {
  _id: string;
  draw_data: {
    numbers: INumbersData[];
    stars: IStarsData[];
    most_least_played?: IMostLeastPlayed;
  };
}
