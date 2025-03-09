// src/components/HomePage.tsx
import React, { useState } from 'react';
import { postDrawData } from '../services/drawDataService';

const HomePage: React.FC = () => {
    const [formData, setFormData] = useState({
        date: '',
        N1: '',
        N2: '',
        N3: '',
        N4: '',
        N5: '',
        E1: '',
        E2: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await postDrawData(formData);
            // Gérer la réponse ici (ex : afficher un message de succès)
            console.log('Réponse du serveur:', response);
        } catch (error) {
            // Gérer l'erreur ici (ex : afficher un message d'erreur)
            console.error("Erreur lors de l'envoi des données:", error);
        }
    };

    return (
        <div>
            <h1>Formulaire de Tirage</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Date:</label>
                    <input
                        type="text"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>N1:</label>
                    <input
                        type="text"
                        name="N1"
                        value={formData.N1}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>N2:</label>
                    <input
                        type="text"
                        name="N2"
                        value={formData.N2}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>N3:</label>
                    <input
                        type="text"
                        name="N3"
                        value={formData.N3}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>N4:</label>
                    <input
                        type="text"
                        name="N4"
                        value={formData.N4}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>N5:</label>
                    <input
                        type="text"
                        name="N5"
                        value={formData.N5}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>E1:</label>
                    <input
                        type="text"
                        name="E1"
                        value={formData.E1}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>E2:</label>
                    <input
                        type="text"
                        name="E2"
                        value={formData.E2}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Envoyer</button>
            </form>
        </div>
    );
};

export default HomePage;
