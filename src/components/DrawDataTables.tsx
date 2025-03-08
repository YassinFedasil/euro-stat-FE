// src/components/DrawDataTables.tsx
import React, { useEffect, useState } from 'react';
import { IDrawData } from '../interfaces/IDrawData';
import { getDrawData } from '../services/drawDataService';
import './DrawDataTables.css'; // Importation du fichier CSS pour le style

const DrawDataTables: React.FC = () => {
    const [draws, setDraws] = useState<IDrawData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDrawData();
                setDraws(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (draws.length === 0) {
        return <div>Aucune donnée disponible</div>;
    }

    // Définition des lignes pour le tableau des numéros
    const numberRows = [
        { label: 'Numéros', field: 'number' },
        { label: 'Fréquence', field: 'frequency' },
        { label: 'Retard', field: 'delay' },
        { label: 'Progression', field: 'progression' },
        { label: 'Fréq. récente', field: 'recent_frequency' },
        { label: 'Fréq. Période Préc', field: 'frequency_previous_period' },
        { label: 'Dernière sortie', field: 'last_out' },
        { label: 'Rapport', field: 'report_reduc' },
        { label: 'Sortie', field: 'out_reduc' },
    ];

    // Définition des lignes pour le tableau des étoiles
    const starRows = [
        { label: 'Étoiles', field: 'star' },
        { label: 'Fréquence', field: 'frequency' },
        { label: 'Retard', field: 'delay' },
        { label: 'Progression', field: 'progression' },
        { label: 'Fréq. récente', field: 'recent_frequency' },
        { label: 'Fréq. Période Préc', field: 'frequency_previous_period' },
        { label: 'Dernière sortie', field: 'last_out' },
    ];

    return (
        <div>
            <h1>Liste des tirages</h1>
            {draws.map((draw) => (
                <div key={draw._id} className="draw-container">
                    <h2>Tirage - ID: {draw._id}</h2>

                    {/* Conteneur flexbox pour afficher les deux tableaux en parallèle */}
                    <div className="tables-container">
                        {/* Tableau des numéros */}
                        <div className="table-wrapper">
                            <h3>Tableau des numéros</h3>
                            <table>
                                <tbody>
                                {numberRows.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td><strong>{row.label}</strong></td>
                                        {draw.draw_data.numbers.map((num, colIndex) => (
                                            <td key={colIndex}>{num[row.field as keyof typeof num]}</td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Tableau des étoiles */}
                        <div className="table-wrapper">
                            <h3>Tableau des étoiles</h3>
                            <table>
                                <tbody>
                                {starRows.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td><strong>{row.label}</strong></td>
                                        {draw.draw_data.stars.map((star, colIndex) => (
                                            <td key={colIndex}>{star[row.field as keyof typeof star]}</td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DrawDataTables;
