// src/components/NumbersResult.tsx
import React, { useEffect, useState } from "react";
import { IDrawData } from "../interfaces/IDrawData.ts";
import { getDrawData } from "../services/drawDataService.ts";
import '../css/NumbersResul.css';

type NumberMetricKey =
    | "frequency"
    | "delay"
    | "progression"
    | "recent_frequency"
    | "frequency_previous_period"
    | "out_reduc"
    | "report_reduc";

const NUMBER_COLUMNS: { label: string; key: NumberMetricKey }[] = [
    { label: "Fréquence", key: "frequency" },
    { label: "Retard", key: "delay" },
    { label: "Progression", key: "progression" },
    { label: "Fréq_récente", key: "recent_frequency" },
    { label: "Fréq_Période_Préc", key: "frequency_previous_period" },
    { label: "Sortie", key: "out_reduc" },
    { label: "Rapport_moyen", key: "report_reduc" },
];

const NumbersResult: React.FC = () => {
    const [draws, setDraws] = useState<IDrawData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDrawData();
                setDraws(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error);
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

    // Regrouper les tirages par deux
    const groupedDraws: IDrawData[][] = [];
    for (let i = 0; i < draws.length; i += 2) {
        groupedDraws.push(draws.slice(i, i + 2));
    }

    return (
        <div className="home-page-numbers-result">
            {groupedDraws.map((group, groupIndex) => (
                <div key={groupIndex} className="draw-group-numbers-result">
                    {group.map((draw) => (
                        <div key={draw._id} className="draw-container-numbers-result">
                            <h2>Tirage: {draw._id}</h2>
                            <div className="tables-container-numbers-result">
                                <div className="table-wrapper-numbers-result">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Numéro</th>
                                            {NUMBER_COLUMNS.map((col) => (
                                                <th key={col.key}>{col.label}</th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {draw.draw_data.numbers
                                            .sort(
                                                (a, b) => Number(a.number) - Number(b.number)
                                            )
                                            .map((num) => (
                                                <tr key={`${draw._id}-${num.number}`}>
                                                    <td>
                                                        <strong>{num.number}</strong>
                                                    </td>
                                                    {NUMBER_COLUMNS.map((col) => (
                                                        <td key={col.key}>
                                                            {String((num as any)[col.key] ?? "")}
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

export default NumbersResult;
