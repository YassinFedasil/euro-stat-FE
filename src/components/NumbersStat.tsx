// src/components/NumbersStat.tsx
import React from 'react';
import { useCallback, useMemo, useState } from "react";

type NumberRow = {
    number: string;
    frequency: string;
    delay: string;
    progression: string;
    recent_frequency: string;
    frequency_previous_period: string;
    last_out: string;
    sorties: string;
    ecart: string;
    rapport_moyen: string;
};

type NumbersDoc = {
    _id: string;           // "MM-JJ"
    numbers: NumberRow[];
};

const MMJJ_REGEX = /^\d{2}-\d{2}$/;
const NumbersStat: React.FC = () => {
    const [mmjj, setMmjj] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [data, setData] = useState<NumbersDoc | null>(null);

    const isValid = useMemo(() => MMJJ_REGEX.test(mmjj.trim()), [mmjj]);

    const onExecute = useCallback(async () => {
        setErr(null);
        setData(null);

        const value = mmjj.trim();
        if (!MMJJ_REGEX.test(value)) {
            setErr("La date doit être au format MM-JJ (ex: 08-29).");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/api/numbers/${encodeURIComponent(value)}`);
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || `HTTP ${res.status}`);
            }
            const json: NumbersDoc = await res.json();
            setData(json);
        } catch (e: any) {
            setErr(e.message || "Erreur inattendue");
        } finally {
            setLoading(false);
        }
    }, [mmjj]);

    return (
        <div style={{ padding: 16 }}>
            <h2 style={{ marginBottom: 12 }}>Numbers – Import/Cache</h2>

            {/* Ligne input + bouton */}
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                <label htmlFor="mmjj" style={{ fontWeight: 600 }}>Date (JJ-MM)</label>
                <input
                    id="mmjj"
                    value={mmjj}
                    onChange={(e) => setMmjj(e.target.value)}
                    placeholder="08-29"
                    style={{ padding: "8px 10px", width: 120, textAlign: "center" }}
                    onKeyDown={(e) => { if (e.key === "Enter") onExecute(); }}
                />
                <button
                    onClick={onExecute}
                    disabled={!isValid || loading}
                    style={{
                        padding: "8px 14px",
                        cursor: isValid && !loading ? "pointer" : "not-allowed",
                        opacity: isValid && !loading ? 1 : 0.6,
                    }}
                    aria-busy={loading}
                >
                    {loading ? "Chargement..." : "Exécuter"}
                </button>
            </div>

            {/* Messages */}
            {!isValid && mmjj.length > 0 && (
                <div style={{ color: "#b00", marginBottom: 8 }}>
                    Format attendu: MM-JJ (ex: 08-29)
                </div>
            )}
            {err && (
                <div style={{ color: "#b00", whiteSpace: "pre-wrap", marginBottom: 8 }}>
                    {err}
                </div>
            )}

            {/* Tableau des résultats */}
            {data && (
                <>
                    <div style={{ marginBottom: 8 }}>
                        <strong>Tirage:</strong> {data._id} — <em>{data.numbers.length} lignes</em>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 900 }}>
                            <thead>
                            <tr>
                                {[
                                    "Numéro","Fréquence","Retard","Progression",
                                    "Fréq_Récente", "Fréq_Période_Préc",
                                    "Sorties","ecart","Rapport_moyen"
                                ].map(h => (
                                    <th key={h} style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: "8px" }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {data.numbers.map((row) => (
                                <tr key={row.number}>
                                    <td style={{ padding: "6px 8px" }}>{row.number}</td>
                                    <td style={{ padding: "6px 8px" }}>{row.frequency}</td>
                                    <td style={{ padding: "6px 8px" }}>{row.delay}</td>
                                    <td style={{ padding: "6px 8px" }}>{row.progression}</td>
                                    <td style={{ padding: "6px 8px" }}>{row.recent_frequency}</td>
                                    <td style={{ padding: "6px 8px" }}>{row.frequency_previous_period}</td>
                                    <td style={{ padding: "6px 8px" }}>{row.sorties}</td>
                                    <td style={{ padding: "6px 8px" }}>{row.ecart}</td>
                                    <td style={{ padding: "6px 8px" }}>{row.rapport_moyen}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default NumbersStat;