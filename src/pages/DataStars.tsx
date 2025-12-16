import { useEffect, useState } from "react";
import { fetchTopStars } from "../services/topXService";

type TopValue = {
    value: string;
    count: number;
};

type ApiResponse = {
    stars: Record<string, TopValue[]>;
};

export default function DataStars() {
    const [top, setTop] = useState(10);
    const [last, setLast] = useState(20);
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [copiedNumbers, setCopiedNumbers] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const result = await fetchTopStars(top, last);
            setData(result);
        } finally {
            setLoading(false);
        }
    };

    // Recharge automatique quand top ou last change
    useEffect(() => {
        loadData();
    }, [top, last]);

    // ------------------- COPY -------------------
    const copyToClipboard = () => {
        if (!data) return;

        let text = `Top ${top} étoiles (sur ${last} tirages)\n\n`;

        Object.entries(data.stars).forEach(([key, values]) => {
            text += `${key.toUpperCase()}\n`;
            values.forEach((v) => {
                text += `- ${v.value} : ${v.count} fois\n`;
            });
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
                    <label className="block text-sm font-medium">
                        Top
                    </label>
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
                    Top {top} étoiles (sur {last} tirages)
                </h2>

                <button
                    className={`px-4 py-2 rounded text-white ${
                        copiedNumbers ? "bg-green-600" : "bg-gray-700 hover:bg-gray-800"
                    }`}
                    onClick={copyToClipboard}
                >
                    Copier
                </button>
            </div>

            {/* Content */}
            {loading && <div>Chargement...</div>}

            {!loading && data && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(data.stars).map(([key, values]) => (
                        <div
                            key={key}
                            className="border rounded-lg p-4 bg-white shadow-sm"
                        >
                            <h3 className="font-semibold capitalize mb-2">
                                {key}
                            </h3>

                            <ul className="text-sm divide-y divide-gray-200">
                                {values.map((v) => (
                                    <li
                                        key={v.value}
                                        className="flex justify-between py-1"
                                    >
                                        <span>{v.value}</span>
                                        <span className="font-medium">
                                            {v.count} fois
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
