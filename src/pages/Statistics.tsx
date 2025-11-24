import { useEffect, useState } from "react";
import { IDrawData } from "./Utils/IDrawData";
import { getDrawData, deleteDrawData } from "../services/drawDataService";
import { Trash2 } from "lucide-react";

const Statistics: React.FC = () => {
  const [draws, setDraws] = useState<IDrawData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  // 🔥 Suppression par double-click
  const handleDelete = async (id: string) => {
    try {
      await deleteDrawData(id);
      setDraws((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  const numberRows = [
    { label: "Numéros", field: "number" },
    { label: "Fréquence", field: "frequency" },
    { label: "Retard", field: "delay" },
    { label: "Progression", field: "progression" },
    { label: "Fréq. récente", field: "recent_frequency" },
    { label: "Fréq. Période Préc", field: "frequency_previous_period" },
    { label: "Rapport", field: "report_reduc" },
    { label: "Sortie", field: "out_reduc" },
    { label: "Ecart", field: "ecart_reduc" },
  ];

  const starRows = [
    { label: "Étoiles", field: "star" },
    { label: "Fréquence", field: "frequency" },
    { label: "Retard", field: "delay" },
    { label: "Progression", field: "progression" },
    { label: "Fréq. récente", field: "recent_frequency" },
    { label: "Fréq. Période Préc", field: "frequency_previous_period" },
  ];

  const groupedDraws = [];
  for (let i = 0; i < draws.length; i += 2) {
    groupedDraws.push(draws.slice(i, i + 2));
  }

  if (loading) return <div>Chargement…</div>;

  return (
      <div className="p-6 space-y-8">

        {groupedDraws.map((group, index) => (
            <div key={index} className="grid grid-cols-1 gap-6">
              {group.map((draw) => (
                  <div
                      key={draw._id}
                      className="bg-white shadow-lg rounded-xl p-6 border"
                      onDoubleClick={() => handleDelete(draw._id)} // 🔥 DOUBLE-CLICK POUR SUPPRIMER
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">
                        Tirage : <span className="text-blue-600">{draw._id}</span>
                      </h2>

                      <Trash2
                          className="text-red-600 cursor-pointer hover:scale-110 transition"
                          size={26}
                          onDoubleClick={() => handleDelete(draw._id)} // 🔥 DOUBLE-CLICK SUR POUBELLE AUSSI
                      />
                    </div>

                    <div className="tables-container flex flex-row gap-6 w-full">
                      <div className="w-1/2">
                        <table className="min-w-full border-collapse border border-gray-300">
                          <tbody>
                          {numberRows.map((row, i) => (
                              <tr key={i}>
                                <td className="border p-2 bg-gray-50 font-semibold">
                                  {row.label}
                                </td>
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

                      <div className="w-1/3">
                        <table className="min-w-full border-collapse border border-gray-300">
                          <tbody>
                          {starRows.map((row, i) => (
                              <tr key={i}>
                                <td className="border p-2 bg-gray-50 font-semibold">
                                  {row.label}
                                </td>
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

                      {draw.draw_data.most_least_played && (
                          <div className="w-1/3">
                            <table className="min-w-full border-collapse border border-gray-300">
                              <tbody>
                              <tr>
                                <td className="border p-2 bg-gray-50 font-semibold">
                                  NumMoinsJouer
                                </td>
                                <td className="border p-2 text-center">
                                  {
                                    draw.draw_data.most_least_played
                                        .least_played_numbers
                                  }
                                </td>
                              </tr>

                              <tr>
                                <td className="border p-2 bg-gray-50 font-semibold">
                                  NumPlusJouer
                                </td>
                                <td className="border p-2 text-center">
                                  {
                                    draw.draw_data.most_least_played
                                        .most_played_numbers
                                  }
                                </td>
                              </tr>

                              <tr>
                                <td className="border p-2 bg-gray-50 font-semibold">
                                  EtoilesMoinsJouer
                                </td>
                                <td className="border p-2 text-center">
                                  {
                                    draw.draw_data.most_least_played
                                        .least_played_stars
                                  }
                                </td>
                              </tr>

                              <tr>
                                <td className="border p-2 bg-gray-50 font-semibold">
                                  EtoilesPlusJouer
                                </td>
                                <td className="border p-2 text-center">
                                  {
                                    draw.draw_data.most_least_played
                                        .most_played_stars
                                  }
                                </td>
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
