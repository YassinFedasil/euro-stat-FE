import { useEffect, useMemo, useState } from "react";
import { fetchTopNumbers } from "../services/topXService";

type TopValue = {
    value: number;
    count: number;
};

type ApiResponse = {
    numbers: Record<string, TopValue[]>;
};

// ✅ Desired display order (human readable)
const ORDER = [
    "FRÉQUENCE",
    "RETARD",
    "PROGRESSION",
    "FRÉQUENCE RÉCENTE",
    "FRÉQ. PÉRIODE PRÉC",
    "SORTIE",
    "ECARTS",
    "RAPPORT",
];

// 🔐 Normalization helper (defensive)
const normalizeKey = (key: string) =>
    key
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^A-Z0-9]/gi, "")
        .toUpperCase();

export default function DataNumbers() {
    const [top, setTop] = useState(10);
    const [last, setLast] = useState(25);
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [copiedNumbers, setCopiedNumbers] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const result = await fetchTopNumbers(top, last);
            setData(result);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [top, last]);

    // 🧠 Build backend-key lookup map (normalized → real key)
    const keyMap = useMemo(() => {
        if (!data) return {};

        const map: Record<string, string> = {};
        Object.keys(data.numbers).forEach((backendKey) => {
            map[normalizeKey(backendKey)] = backendKey;
        });

        return map;
    }, [data]);

    // ------------------- COPY -------------------
    const copyToClipboard = () => {
        if (!data) return;

        let text = `Top ${top} (sur ${last} tirages)\n\n`;

        ORDER.forEach((label) => {
            const backendKey = keyMap[normalizeKey(label)];
            if (!backendKey) return;

            const values = data.numbers[backendKey];
            if (!values) return;

            text += `${label}\n`;
            values.forEach((v) => {
                text += `- ${v.value} : ${v.count} fois\n`;
            });

            // 🔹 Ajouter l'explication pour FRÉQUENCE
            if (label.toUpperCase() === "FRÉQUENCE") {
                text += `\n- Exemple 1 : "4x2 | 5x3 : 10 fois" Signifie que 2 nombres sont dans la tranche 4,xx (entre 4,01% et 4,99%) et 3 nombres sont dans la tranche 5,xx et cette répartition ("4x2 | 5x3") est sortie 10 fois dans les 25 derniers tirages.\n`;
                text += `- Exemple 2 : "5x5 : 2 fois" Signifie que 5 nombres sont dans la tranche 5,xx (entre 5,01% et 5,99%) et cette répartition ("5x5") est sortie 2 fois dans les 25 derniers tirages.\n`;
            }

            text += "\n";
        });

        navigator.clipboard.writeText(text);
        setCopiedNumbers(true);
        setTimeout(() => setCopiedNumbers(false), 300);
    };
    // --------------------------------------------

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-wrap items-end gap-4">
                <div>
                    <label className="block text-sm font-medium">Top</label>
                    <input
                        type="number"
                        min={1}
                        value={top}
                        onChange={(e) => setTop(Number(e.target.value))}
                        className="border rounded px-3 py-1 w-24"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">
                        Sur (tirages)
                    </label>
                    <input
                        type="number"
                        min={1}
                        value={last}
                        onChange={(e) => setLast(Number(e.target.value))}
                        className="border rounded px-3 py-1 w-28"
                    />
                </div>

                <button
                    onClick={loadData}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    Appliquer
                </button>
            </div>

            {/* Title + Copy */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                    Top {top} (sur {last} tirages)
                </h2>

                <button
                    onClick={copyToClipboard}
                    className={`px-4 py-2 rounded text-white ${
                        copiedNumbers
                            ? "bg-green-600"
                            : "bg-gray-700 hover:bg-gray-800"
                    }`}
                >
                    Copier
                </button>
            </div>

            {/* Content */}
            {loading && <div>Chargement...</div>}

            {!loading && data && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ORDER.map((label) => {
                        const backendKey =
                            keyMap[normalizeKey(label)];
                        if (!backendKey) return null;

                        const values = data.numbers[backendKey];
                        if (!values) return null;

                        return (
                            <div
                                key={label}
                                className="border rounded-lg p-4 bg-white shadow-sm"
                            >
                                <h3 className="font-semibold mb-2">
                                    {label}
                                </h3>

                                <ul className="space-y-1 text-sm divide-y divide-gray-200">
                                    {values.map((v) => (
                                        <li
                                            key={v.value}
                                            className="flex justify-between"
                                        >
                                            <span>{v.value}</span>
                                            <span className="font-medium">
                                                {v.count} fois
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
