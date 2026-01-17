import React, { useCallback, useMemo, useState, useRef, useEffect } from "react";

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
    const today = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const defaultDate = `${pad(today.getDate())}-${pad(today.getMonth() + 1)}`;

    const [mmjj, setMmjj] = useState(defaultDate);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [data, setData] = useState<StarsDoc | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof StarRow; direction: "asc" | "desc" } | null>(null);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [dragSelectedRows, setDragSelectedRows] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const tableRef = useRef<HTMLDivElement>(null);

    const isValid = useMemo(() => MMJJ_REGEX.test(mmjj.trim()), [mmjj]);

    const onExecute = useCallback(async () => {
        setErr(null);
        setData(null);
        setSelectedRows([]);
        setDragSelectedRows([]);

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

    const requestSort = (key: keyof StarRow) => {
        setSortConfig((prev) => {
            if (prev?.key === key) {
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            return { key, direction: "asc" };
        });
    };

    const sortedStars = useMemo(() => {
        if (!data) return [];
        const starsCopy = [...data.stars];
        if (sortConfig) {
            starsCopy.sort((a, b) => {
                const valA = isNaN(Number(a[sortConfig.key])) ? a[sortConfig.key] : Number(a[sortConfig.key]);
                const valB = isNaN(Number(b[sortConfig.key])) ? b[sortConfig.key] : Number(b[sortConfig.key]);
                if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
                if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }
        return starsCopy;
    }, [data, sortConfig]);

    const headers: { label: string; key: keyof StarRow }[] = [
        { label: "Numéro", key: "star" },
        { label: "Fréquence", key: "frequency" },
        { label: "Retard", key: "delay" },
        { label: "Progression", key: "progression" },
        { label: "Fréq_Récente", key: "recent_frequency" },
        { label: "Fréq_Période_Préc", key: "frequency_previous_period" },
    ];

    const handleDoubleClick = (star: string) => {
        setSelectedRows((prev) => {
            if (prev.includes(star)) {
                return prev.filter((s) => s !== star);
            } else if (prev.length < 2) {
                return [...prev, star];
            }
            return prev;
        });
    };

    // Gestion du drag pour sélection multiple
    const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);

    const handleMouseDown = (index: number) => {
        setIsDragging(true);
        setDragStartIndex(index);

        // Pour commencer avec une seule ligne sélectionnée par drag
        const star = sortedStars[index].star;
        if (!dragSelectedRows.includes(star)) {
            setDragSelectedRows([star]);
        }
    };

    const handleMouseEnter = (index: number) => {
        if (isDragging && dragStartIndex !== null) {

            const start = Math.min(dragStartIndex, index);
            const end = Math.max(dragStartIndex, index);

            const selected = sortedStars
                .slice(start, end + 1)
                .map(row => row.star);

            setDragSelectedRows(selected);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDragStartIndex(null);
    };

    // Gestion du double-clic en dehors du tableau pour désélectionner
    const handleContainerDoubleClick = (e: React.MouseEvent) => {
        if (e.target === tableRef.current || tableRef.current?.contains(e.target as Node)) {
            // Si le clic est sur le tableau lui-même, ne rien faire
            return;
        }
        setDragSelectedRows([]);
    };

    // Gestionnaire global pour la souris
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setIsDragging(false);
            setDragStartIndex(null);
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    const copyTable = () => {
        if (!data) return;
        const headerLine = headers.map((h) => h.label).join("\t");
        const rowsText = sortedStars.map((row) =>
            headers.map((h) => row[h.key]).join("\t")
        );
        const textToCopy = [`Voici le tableau de statistiques actuelles des Etoiles:`, headerLine, ...rowsText].join("\n");
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };

    // Déterminer la couleur de fond
    const getRowBackground = (star: string) => {
        if (selectedRows.includes(star)) {
            return "bg-yellow-300";
        }
        if (dragSelectedRows.includes(star)) {
            return "bg-cyan-100";
        }
        return "hover:bg-gray-50";
    };

    return (
        <div className="p-4" onDoubleClick={handleContainerDoubleClick}>
            {/* Ligne input + boutons */}
            <div className="flex gap-2 items-center mb-3 justify-between">
                <div className="flex gap-2 items-center">
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
                    >
                        {loading ? "Chargement..." : "Exécuter"}
                    </button>
                </div>
                {data && (
                    <button
                        onClick={copyTable}
                        className={`px-3 py-1 rounded font-semibold text-white ${copied ? "bg-green-400" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                        {copied ? "Copié !" : "Copier le tableau"}
                    </button>
                )}
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
                    <div
                        ref={tableRef}
                        className="overflow-x-auto"
                        onMouseLeave={() => {
                            if (isDragging) {
                                setIsDragging(false);
                                setDragStartIndex(null);
                            }
                        }}
                    >
                        <table className="min-w-[820px] w-full border-collapse border border-gray-300">
                            <thead>
                            <tr className="bg-gray-100">
                                {headers.map(({ label, key }) => (
                                    <th
                                        key={key}
                                        className="border border-gray-300 px-3 py-2 text-center cursor-pointer"
                                        onClick={() => requestSort(key)}
                                    >
                                        {label} {sortConfig?.key === key ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {sortedStars.map((row, index) => (
                                <tr
                                    key={row.star}
                                    onDoubleClick={() => handleDoubleClick(row.star)}
                                    onMouseDown={() => handleMouseDown(index)}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseUp={handleMouseUp}
                                    className={`
                                        ${getRowBackground(row.star)}
                                        ${isDragging ? "cursor-crosshair" : "cursor-default"}
                                        select-none
                                    `}
                                >
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
};

export default Stars;