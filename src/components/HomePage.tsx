// src/components/HomePage.tsx
import React, {useEffect, useState} from 'react';
import {IDrawData} from '../interfaces/IDrawData';
import {getDrawData} from '../services/drawDataService';
import '../css/HomePage.css';

const HomePage: React.FC = () => {
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

    // Définit les lignes du tableau pour les numéros et les étoiles
    const numberRows = [
        {label: 'Numéros', field: 'number'},
        {label: 'Fréquence', field: 'frequency'},
        {label: 'Retard', field: 'delay'},
        {label: 'Progression', field: 'progression'},
        {label: 'Fréq. récente', field: 'recent_frequency'},
        {label: 'Fréq. Période Préc', field: 'frequency_previous_period'},
        {label: 'Dernière sortie', field: 'last_out'},
        {label: 'Rapport', field: 'report_reduc'},
        {label: 'Sortie', field: 'out_reduc'},
    ];

    const starRows = [
        {label: 'Étoiles', field: 'star'},
        {label: 'Fréquence', field: 'frequency'},
        {label: 'Retard', field: 'delay'},
        {label: 'Progression', field: 'progression'},
        {label: 'Fréq. récente', field: 'recent_frequency'},
        {label: 'Fréq. Période Préc', field: 'frequency_previous_period'},
        {label: 'Dernière sortie', field: 'last_out'},
    ];

    // Regrouper les tirages par deux
    const groupedDraws = [];
    for (let i = 0; i < draws.length; i += 2) {
        groupedDraws.push(draws.slice(i, i + 2));
    }

    return (
        <div className="home-page">
            {groupedDraws.map((group, groupIndex) => (
                <div key={groupIndex} className="draw-group">
                    {group.map((draw) => (
                        <div key={draw._id} className="draw-container">
                            <h2>Tirage: {draw._id}</h2>
                            <div className="tables-container">
                                <div className="table-wrapper-numbers">
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
                                <div className="table-wrapper-stars">
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
                                {draw.draw_data.most_least_played && (
                                    <div className="table-wrapper-most-least">
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td><strong>NumMoinsJouer</strong></td>
                                                <td>{draw.draw_data.most_least_played.least_played_numbers}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>NumPlusJouer</strong></td>
                                                <td>{draw.draw_data.most_least_played.most_played_numbers}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>EtoilesMoinsJouer</strong></td>
                                                <td>{draw.draw_data.most_least_played.least_played_stars}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>EtoilesPlusJouer</strong></td>
                                                <td>{draw.draw_data.most_least_played.most_played_stars}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default HomePage;