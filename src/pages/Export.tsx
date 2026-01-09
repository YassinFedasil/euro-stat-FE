import {useState} from "react";
import Input from "../components/form/input/InputField.tsx";
import Button from "../components/ui/button/Button.tsx";

export default function Export() {
    const [form, setForm] = useState({
        date: "",
        N1: "",
        N2: "",
        N3: "",
        N4: "",
        N5: "",
        E1: "",
        E2: ""
    });

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState("");
    const [responseType, setResponseType] = useState<"success" | "error" | "info">("info");

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({...prev, [field]: value}));
    };

    const validateForm = () => {
        // Vérifier que tous les champs sont remplis
        for (const key in form) {
            if (!form[key as keyof typeof form].trim()) {
                setResponse(`Veuillez remplir tous les champs !`);
                return false;
            }
        }

        // Validation de la date (format xx-xx)
        if (!/^\d{2}-\d{2}$/.test(form.date)) {
            setResponse("La date doit être au format DD-MM");
            return false;
        }

        // Validation N1 - N5
        for (const n of ["N1", "N2", "N3", "N4", "N5"]) {
            const value = form[n as keyof typeof form];
            if (!/^\d{1,2}$/.test(value)) {
                setResponse(`${n} doit être un ou deux chiffres`);
                return false;
            }
            const num = parseInt(value, 10);
            if (num < 1 || num > 50) {
                setResponse(`${n} doit être compris entre 1 et 50`);
                return false;
            }
        }

        // Validation E1 - E2
        for (const n of ["E1", "E2"]) {
            const value = form[n as keyof typeof form];
            if (!/^\d+$/.test(value)) {
                setResponse(`${n} doit être un nombre`);
                return false;
            }
            const num = parseInt(value, 10);
            if (num < 1 || num > 12) {
                setResponse(`${n} doit être compris entre 1 et 12`);
                return false;
            }
        }

        return true;
    };

    const submitForm = async (e: any) => {
        e.preventDefault();
        setResponse("");
        setResponseType("info");

        if (!validateForm()) return;

        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/api/extract-drive", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(form),
            });

            const data = await res.json();
            setResponse(data.message || "Extraction terminée.");
            setResponseType("success");
        } catch (error) {
            setResponse("Erreur de connexion au serveur.");
            setResponseType("error");
        }

        setLoading(false);
    };

    return (
        <div>
            <a
                href="https://drive.google.com/drive/folders/1ZN-VMaKEAQzArsJtoAkD8En2H7BW4WQy"
                target="_blank"
                rel="noopener noreferrer"
            >
                Export from Google Drive
            </a>
            <div className="max-w-md mx-auto">
                <form onSubmit={submitForm} className="space-y-2">

                    {/* Date */}
                    <Input
                        placeholder="Sélectionnez une date DD-MM"
                        value={form.date}
                        onChange={(e) => handleChange("date", e.target.value)}
                    />

                    <div className="border-b pb-2"></div>

                    {/* N1 - N5 */}
                    {["N1", "N2", "N3", "N4", "N5"].map((n) => (
                        <Input
                            key={n}
                            placeholder={n}
                            value={form[n as keyof typeof form]}
                            onChange={(e) => handleChange(n, e.target.value)}
                        />
                    ))}

                    <div className="border-b pb-2"></div>

                    {/* E1 - E2 */}
                    {["E1", "E2"].map((n) => (
                        <Input
                            key={n}
                            placeholder={n}
                            value={form[n as keyof typeof form]}
                            onChange={(e) => handleChange(n, e.target.value)}
                        />
                    ))}

                    <Button className="w-full" size="sm" disabled={loading}>
                        {loading ? "Extraction..." : "Exporter"}
                    </Button>

                    {response && (
                        <div className={`mt-3 text-center text-sm ${
                            responseType === "success" ? "text-green-600" :
                                responseType === "error" ? "text-red-600" : "text-red-800"
                        }`}>
                            {response}
                        </div>
                    )}

                </form>
            </div>
        </div>
    );
}
