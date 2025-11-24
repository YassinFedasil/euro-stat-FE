import React, { useCallback, useMemo, useState } from "react";

type StarRow = {
    star: string;
    frequency: string;
    delay: string;
    progression: string;
    recent_frequency: string;
    frequency_previous_period: string;
    last_out: string;
};

type StarsDoc = {
    _id: string; // "MM-JJ"
    stars: StarRow[];
};

const MMJJ_REGEX = /^\d{2}-\d{2}$/;

const Stars: React.FC = () => {
    // Génère la date du jour au format JJ-MM
    const today = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const defaultDate = `${pad(today.getDate())}-${pad(today.getMonth() + 1)}`;

    const [mmjj, setMmjj] = useState(defaultDate);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [data, setData] = useState<StarsDoc | null>(null);

    const isValid = useMemo(() => MMJJ_REGEX.test(mmjj.trim()), [mmjj]);

    const onExecute = useCallback(async () => {
        setErr(null);
        setData(null);

        const value = mmjj.trim();
        if (!MMJJ_REGEX.test(value)) {
            setErr("La date doit être au format JJ-MM (ex: 08-29).");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/api/stars/${encodeURIComponent(value)}`);
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || `HTTP ${res.status}`);
            }
            const json: StarsDoc = await res.json();
            setData(json);
        } catch (e: any) {
            setErr(e.message || "Erreur inattendue");
        } finally {
            setLoading(false);
        }
    }, [mmjj]);

    return (
        <div className="p-4">
            {/* Ligne input + bouton */}
            <div className="flex gap-2 items-center mb-3">
                <label htmlFor="mmjj" className="font-semibold">Date (JJ-MM)</label>
                <input
                    id="mmjj"
                    value={mmjj}
                    onChange={(e) => setMmjj(e.target.value)}
                    placeholder={defaultDate}
                    className="px-2 py-1 w-32 text-center border border-gray-300 rounded"
                    onKeyDown={(e) => { if (e.key === "Enter") onExecute(); }}
                />
                <button
                    onClick={onExecute}
                    disabled={!isValid || loading}
                    className={`px-3 py-1 rounded font-semibold text-white ${isValid && !loading ? "bg-green-600 hover:bg-green-700 cursor-pointer" : "bg-gray-400 cursor-not-allowed"}`}
                    aria-busy={loading}
                >
                    {loading ? "Chargement..." : "Exécuter"}
                </button>
            </div>

            {/* Messages */}
            {!isValid && mmjj.length > 0 && (
                <div className="text-red-700 mb-2">
                    Format attendu: JJ-MM (ex: 08-29)
                </div>
            )}
            {err && (
                <div className="text-red-700 whitespace-pre-wrap mb-2">
                    {err}
                </div>
            )}

            {/* Tableau des résultats */}
            {data && (
                <>
                    <div className="mb-2 text-blue-600">
                        <strong>Tirage:</strong> {data._id}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-[820px] w-full border-collapse border border-gray-300">
                            <thead>
                            <tr className="bg-gray-100">
                                {[
                                    "Numéro", "Fréquence", "Retard", "Progression",
                                    "Fréq_Récente", "Fréq_Période_Préc"
                                ].map(h => (
                                    <th
                                        key={h}
                                        className="border border-gray-300 px-3 py-2 text-center"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {data.stars.map((row) => (
                                <tr key={row.star} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-2 py-1 text-center">{row.star}</td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">{row.frequency}</td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">{row.delay}</td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">{row.progression}</td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">{row.recent_frequency}</td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">{row.frequency_previous_period}</td>
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

export default Stars;
