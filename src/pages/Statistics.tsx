import {useEffect, useState} from "react";
import {IDrawData} from "./Utils/IDrawData";
import {getDrawData, deleteDrawData} from "../services/drawDataService";
import {Trash2} from "lucide-react";

const Statistics: React.FC = () => {
    const [draws, setDraws] = useState<IDrawData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [copyLast, setCopyLast] = useState<number>(1); // combien de tirages récentes à copier
    const [copiedNumbers, setCopiedNumbers] = useState(false);
    const [copiedStars, setCopiedStars] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDrawData();
                setDraws(data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteDrawData(id);
            setDraws((prev) => prev.filter((d) => d._id !== id));
        } catch {
            alert("Erreur lors de la suppression");
        }
    };

    const numberRows = [
        {label: "Numéros", field: "number"},
        {label: "Fréquence", field: "frequency"},
        {label: "Retard", field: "delay"},
        {label: "Progression", field: "progression"},
        {label: "Fréq. récente", field: "recent_frequency"},
        {label: "Fréq. Période Préc", field: "frequency_previous_period"},
        {label: "Rapport", field: "report_reduc"},
        {label: "Sortie", field: "out_reduc"},
        {label: "Ecart", field: "ecart_reduc"},
    ];

    const starRows = [
        {label: "Étoiles", field: "star"},
        {label: "Fréquence", field: "frequency"},
        {label: "Retard", field: "delay"},
        {label: "Progression", field: "progression"},
        {label: "Fréq. récente", field: "recent_frequency"},
        {label: "Fréq. Période Préc", field: "frequency_previous_period"},
    ];

    const groupedDraws = [];
    for (let i = 0; i < draws.length; i += 2) {
        groupedDraws.push(draws.slice(i, i + 2));
    }

    if (loading) return <div>Chargement…</div>;

    // ------------------- COPY NUMBERS -------------------
    const copyNumbersToClipboard = () => {
        const selectedDraws = draws.slice(0, copyLast);
        if (!selectedDraws.length) return;

        let text = "";
        selectedDraws.forEach((draw) => {
            text += `Tirage : ${draw._id}\n`;
            text += numberRows.map((row) => row.label).join("\t") + "\n";

            for (let i = 0; i < draw.draw_data.numbers.length; i++) {
                const rowValues = numberRows.map(
                    (row) => draw.draw_data.numbers[i][row.field as keyof typeof draw.draw_data.numbers[number]]
                );
                text += rowValues.join("\t") + "\n";
            }

            text += "\n---------------------------\n\n";
        });

        navigator.clipboard.writeText(text);
        setCopiedNumbers(true);
        setTimeout(() => setCopiedNumbers(false), 300);
    };

    // ------------------- COPY STARS -------------------
    const copyStarsToClipboard = () => {
        const selectedDraws = draws.slice(0, copyLast);
        if (!selectedDraws.length) return;

        let text = "";
        selectedDraws.forEach((draw) => {
            text += `Tirage : ${draw._id}\n`;
            text += starRows.map((row) => row.label).join("\t") + "\n";

            for (let i = 0; i < draw.draw_data.stars.length; i++) {
                const rowValues = starRows.map(
                    (row) => draw.draw_data.stars[i][row.field as keyof typeof draw.draw_data.stars[number]]
                );
                text += rowValues.join("\t") + "\n";
            }

            text += "\n---------------------------\n\n";
        });

        navigator.clipboard.writeText(text);
        setCopiedStars(true);
        setTimeout(() => setCopiedStars(false), 2000);
    };
    // ---------------------------------------------------

    return (
        <div className="p-6 space-y-8">
            {/* Boutons copier et input */}
            <div className="flex items-center gap-2 mb-4">
                <input
                    type="number"
                    min={1}
                    max={draws.length}
                    value={copyLast}
                    onChange={(e) => setCopyLast(Number(e.target.value))}
                    className="border rounded px-2 py-1 w-20 text-sm"
                    title="Nombre de tirages récentes à copier"
                />
                <button
                    className={`px-4 py-2 rounded text-white ${
                        copiedNumbers ? "bg-green-600" : "bg-gray-700 hover:bg-gray-800"
                    }`}
                    onClick={copyNumbersToClipboard}
                >
                    Copier les numéros
                </button>
                <button
                    className={`px-4 py-2 rounded text-white ${
                        copiedStars ? "bg-green-600" : "bg-gray-700 hover:bg-gray-800"
                    }`}
                    onClick={copyStarsToClipboard}
                >
                    Copier les étoiles
                </button>
            </div>

            {groupedDraws.map((group, index) => (
                <div key={index} className="grid grid-cols-1 gap-6">
                    {group.map((draw) => (
                        <div
                            key={draw._id}
                            className="bg-white shadow-lg rounded-xl p-6 border"
                            onDoubleClick={() => handleDelete(draw._id)}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">
                                    Tirage : <span className="text-blue-600">{draw._id}</span>
                                </h2>

                                <Trash2
                                    className="text-red-600 cursor-pointer hover:scale-110 transition"
                                    size={26}
                                    onDoubleClick={() => handleDelete(draw._id)}
                                />
                            </div>

                            <div className="tables-container flex flex-row gap-6 w-full">
                                {/* NUMBERS */}
                                <div className="w-1/2">
                                    <table className="min-w-full border-collapse border border-gray-300">
                                        <tbody>
                                        {numberRows.map((row, i) => (
                                            <tr key={i}>
                                                <td className="border p-2 bg-gray-50 font-semibold">{row.label}</td>
                                                {draw.draw_data.numbers.map((num, j) => (
                                                    <td key={j} className="border text-center p-2">
                                                        {num[row.field as keyof typeof num]}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* STARS */}
                                <div className="w-1/3">
                                    <table className="min-w-full border-collapse border border-gray-300">
                                        <tbody>
                                        {starRows.map((row, i) => (
                                            <tr key={i}>
                                                <td className="border p-2 bg-gray-50 font-semibold">{row.label}</td>
                                                {draw.draw_data.stars.map((star, j) => (
                                                    <td key={j} className="border text-center p-2">
                                                        {star[row.field as keyof typeof star]}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* MOST/LEAST PLAYED */}
                                {draw.draw_data.most_least_played && (
                                    <div className="w-1/3">
                                        <table className="min-w-full border-collapse border border-gray-300">
                                            <tbody>
                                            <tr>
                                                <td className="border p-2 bg-gray-50 font-semibold">NumMoinsJouer</td>
                                                <td className="border p-2 text-center">{draw.draw_data.most_least_played.least_played_numbers}</td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2 bg-gray-50 font-semibold">NumPlusJouer</td>
                                                <td className="border p-2 text-center">{draw.draw_data.most_least_played.most_played_numbers}</td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2 bg-gray-50 font-semibold">EtoilesMoinsJouer</td>
                                                <td className="border p-2 text-center">{draw.draw_data.most_least_played.least_played_stars}</td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2 bg-gray-50 font-semibold">EtoilesPlusJouer</td>
                                                <td className="border p-2 text-center">{draw.draw_data.most_least_played.most_played_stars}</td>
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

export default Statistics;
