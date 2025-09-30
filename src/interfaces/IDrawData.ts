
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

// Interface pour les données des étoiles
export interface IStarsData {
    star: string;
    frequency: string;
    delay: string;
    progression: string;
    recent_frequency: string;
    frequency_previous_period: string;
    last_out: string;
}

// Interface pour les données most/least played
export interface IMostLeastPlayed {
    least_played_numbers: string; // Ex: "2 indice[2,4]"
    most_played_numbers: string;
    least_played_stars: string;
    most_played_stars: string;
}

// Interface pour un document complet
export interface IDrawData {
    _id: string;
    draw_data: {
        numbers: INumbersData[];
        stars: IStarsData[];
        most_least_played?: IMostLeastPlayed;
    };
}