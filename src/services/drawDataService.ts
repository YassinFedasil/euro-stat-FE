// src/services/drawDataService.ts
import axios from 'axios';
import { IDrawData } from '../interfaces/IDrawData';

const API_URL = "http://localhost:8000/api/draw-data";

export const getDrawData = async (): Promise<IDrawData[]> => {
    try {
        const response = await axios.get<IDrawData[]>(API_URL);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
};
