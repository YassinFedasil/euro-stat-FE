import React, { useEffect, useState } from 'react';
import { IDrawData } from "../interfaces/IDrawData.ts";
import { getDrawData } from "../services/drawDataService.ts";
import '../css/StarsResul.css';

type StarMetricKey =
    | 'frequency'
    | 'delay'
    | 'progression'
    | 'recent_frequency'
    | 'frequency_previous_period';

const STAR_COLUMNS: { label: string; key: StarMetricKey }[] = [
    { label: 'Fréquence', key: 'frequency' },
    { label: 'Retard', key: 'delay' },
    { label: 'Progression', key: 'progression' },
    { label: 'Fréq_récente', key: 'recent_frequency' },
    { label: 'Fréq_Période_Préc', key: 'frequency_previous_period' },
];

const StarsResult: React.FC = () => {
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

    if (loading) return <div>Chargement...</div>;
    if (draws.length === 0) return <div>Aucune donnée disponible</div>;

    // Regrouper les tirages par deux
    const groupedDraws: IDrawData[][] = [];
    for (let i = 0; i < draws.length; i += 2) {
        groupedDraws.push(draws.slice(i, i + 2));
    }

    return (
        <div className="home-page-star-result">
            {groupedDraws.map((group, groupIndex) => (
                <div key={groupIndex} className="draw-group-star-result">
                    {group.map((draw) => (
                        <div key={draw._id} className="draw-container-star-result">
                            <h2>Tirage: {draw._id}</h2>

                            <div className="tables-container-star-result">
                                <div className="table-wrapper-stars-star-result">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Étoiles</th>
                                            {STAR_COLUMNS.map((col) => (
                                                <th key={col.key}>{col.label}</th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {draw.draw_data.stars.map((star) => (
                                            <tr key={`${draw._id}-${star.star}`}>
                                                <td><strong>{star.star}</strong></td>
                                                {STAR_COLUMNS.map((col) => (
                                                    <td key={col.key}>
                                                        {/* cast sûr car col.key ∈ StarMetricKey */}
                                                        {String((star as any)[col.key] ?? '')}
                                                    </td>
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
            ))}
        </div>
    );
};

export default StarsResult;