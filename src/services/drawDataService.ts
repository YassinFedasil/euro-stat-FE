// src/services/drawDataService.ts
import axios from 'axios';
import {IDrawData} from "../pages/Utils/IDrawData.ts";


const API_URL = "http://localhost:8000/api/draw-data";

export const getDrawData = async (): Promise<IDrawData[]> => {
    try {
        const response = await axios.get<IDrawData[]>(API_URL);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
};

// Service POST pour envoyer des données
export const postDrawData = async (formData: any): Promise<any> => {
    try {
        const response = await axios.post(`${API_URL}/extract-data`, formData);  // Ajoutez les crochets ici !
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'envoi des données :", error);
        throw error;
    }

};

// ⛔ NOUVEAU : supprimer un tirage
export const deleteDrawData = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};
