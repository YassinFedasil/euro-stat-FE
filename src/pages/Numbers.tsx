import { useCallback, useMemo, useState, useRef, useEffect } from "react";

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

type FilterOption = {
    label: string;
    min?: number;
    max?: number;
    value?: number | string;
    count: number;
    display_range?: string;
    type: "interval" | "individual";
};

type FilterCategory = {
    intervals?: FilterOption[];
    individual?: FilterOption[];
};

type FilterOptions = {
    frequency: FilterCategory;
    delay: FilterCategory;
    progression: FilterCategory;
    recent_frequency: FilterCategory;
    frequency_previous_period: FilterCategory;
    sorties: FilterCategory;
    ecart: FilterCategory;
    rapport_moyen: FilterCategory;
};

type SelectedFilters = {
    [key in keyof FilterOptions]?: {
        intervals?: string[];
        individual?: string[];
    };
};

const MMJJ_REGEX = /^\d{2}-\d{2}$/;

const Numbers: React.FC = () => {
    const today = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const defaultDate = `${pad(today.getDate())}-${pad(today.getMonth() + 1)}`;

    const [mmjj, setMmjj] = useState(defaultDate);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [data, setData] = useState<NumbersDoc | null>(null);
    const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
    const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
    const [showFilters, setShowFilters] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: keyof NumberRow; direction: "asc" | "desc" } | null>(null);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [dragSelectedRows, setDragSelectedRows] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const tableRef = useRef<HTMLDivElement>(null);

    const isValid = useMemo(() => MMJJ_REGEX.test(mmjj.trim()), [mmjj]);

    // Fonction pour charger les données et les options de filtrage
    const onExecute = useCallback(async () => {
        setErr(null);
        setData(null);
        setFilterOptions(null);
        setSelectedFilters({});
        setSelectedRows([]);
        setDragSelectedRows([]);

        const value = mmjj.trim();
        if (!MMJJ_REGEX.test(value)) {
            setErr("La date doit être au format JJ-MM (ex: 08-29).");
            return;
        }

        setLoading(true);
        try {
            // Charger les données
            const res = await fetch(`http://localhost:8000/api/numbers/${encodeURIComponent(value)}`);
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || `HTTP ${res.status}`);
            }
            const json: NumbersDoc = await res.json();
            setData(json);

            // Charger les options de filtrage
            const filterRes = await fetch(`http://localhost:8000/api/numbers/${encodeURIComponent(value)}/filter-options`);
            if (filterRes.ok) {
                const filterJson = await filterRes.json();
                setFilterOptions(filterJson.filter_options);
            }
        } catch (e: any) {
            setErr(e.message || "Erreur inattendue");
        } finally {
            setLoading(false);
        }
    }, [mmjj]);

    // Fonction pour extraire la valeur numérique d'une chaîne
    const extractNumericValue = (value: string): number | null => {
        if (!value || value === "N/A") return null;

        // Gérer les cas spéciaux
        if (value.includes("+∞") || value.includes("-∞") || value === "=") {
            return null;
        }

        const cleaned = value.replace(',', '.').replace('%', '').trim();
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
    };

    // Fonction pour vérifier si une valeur est dans un intervalle
    const isValueInRange = (value: string, min: number, max: number): boolean => {
        const num = extractNumericValue(value);
        return num !== null && num >= min && num <= max;
    };

    // Fonction pour vérifier si une valeur correspond à une option individuelle
    const isValueMatching = (value: string, target: number | string): boolean => {
        if (typeof target === 'number') {
            const num = extractNumericValue(value);
            return num !== null && Math.abs(num - target) < 0.01;
        } else {
            return value === target;
        }
    };

    // Fonction pour filtrer les données
    const filteredNumbers = useMemo(() => {
        if (!data) return [];

        return data.numbers.filter(row => {
            // Si aucun filtre n'est sélectionné, tout afficher
            if (Object.keys(selectedFilters).length === 0) return true;

            // Vérifier chaque catégorie de filtre
            for (const [key, filters] of Object.entries(selectedFilters)) {
                const filterKey = key as keyof FilterOptions;
                const categoryFilters = filterOptions?.[filterKey];
                const value = row[filterKey as keyof NumberRow];

                let matchFound = true;

                // Vérifier les filtres par intervalles
                if (filters?.intervals && filters.intervals.length > 0) {
                    const intervalOptions = categoryFilters?.intervals || [];
                    const selectedIntervals = intervalOptions.filter(opt =>
                        filters.intervals?.includes(opt.label)
                    );

                    const inInterval = selectedIntervals.some(interval =>
                        interval.min !== undefined && interval.max !== undefined &&
                        isValueInRange(value, interval.min, interval.max)
                    );

                    if (!inInterval) matchFound = false;
                }

                // Vérifier les filtres individuels
                if (filters?.individual && filters.individual.length > 0 && matchFound) {
                    const individualOptions = categoryFilters?.individual || [];
                    const selectedIndividual = individualOptions.filter(opt =>
                        filters.individual?.includes(opt.label)
                    );

                    const matchesIndividual = selectedIndividual.some(opt => {
                        if (opt.value !== undefined) {
                            return isValueMatching(value, opt.value);
                        }
                        return false;
                    });

                    if (!matchesIndividual) matchFound = false;
                }

                if (!matchFound) return false;
            }

            return true;
        });
    }, [data, filterOptions, selectedFilters]);

    const requestSort = (key: keyof NumberRow) => {
        setSortConfig((prev) => {
            if (prev?.key === key) {
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            return { key, direction: "asc" };
        });
    };

    const sortedNumbers = useMemo(() => {
        if (!filteredNumbers) return [];
        const numbersCopy = [...filteredNumbers];
        if (sortConfig) {
            numbersCopy.sort((a, b) => {
                // Pour la progression (valeurs textuelles)
                if (sortConfig.key === 'progression') {
                    const valA = a[sortConfig.key];
                    const valB = b[sortConfig.key];
                    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
                    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
                    return 0;
                }

                // Pour les valeurs numériques
                const valA = extractNumericValue(a[sortConfig.key]) ?? a[sortConfig.key];
                const valB = extractNumericValue(b[sortConfig.key]) ?? b[sortConfig.key];

                if (typeof valA === 'number' && typeof valB === 'number') {
                    return sortConfig.direction === "asc" ? valA - valB : valB - valA;
                }

                // Fallback pour les chaînes
                const strA = String(valA);
                const strB = String(valB);
                if (strA < strB) return sortConfig.direction === "asc" ? -1 : 1;
                if (strA > strB) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }
        return numbersCopy;
    }, [filteredNumbers, sortConfig]);

    const headers: { label: string; key: keyof NumberRow }[] = [
        { label: "Numéro", key: "number" },
        { label: "Fréquence", key: "frequency" },
        { label: "Retard", key: "delay" },
        { label: "Progression", key: "progression" },
        { label: "Fréq_Récente", key: "recent_frequency" },
        { label: "Fréq_Période_Préc", key: "frequency_previous_period" },
        { label: "Sorties", key: "sorties" },
        { label: "Ecart", key: "ecart" },
        { label: "Rapport_moyen", key: "rapport_moyen" },
    ];

    const handleDoubleClick = (number: string) => {
        setSelectedRows((prev) => {
            if (prev.includes(number)) {
                return prev.filter((n) => n !== number);
            } else if (prev.length < 5) {
                return [...prev, number];
            }
            return prev;
        });
    };

    // Gestion du drag pour sélection multiple
    const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);

    const handleMouseDown = (index: number) => {
        setIsDragging(true);
        setDragStartIndex(index);
        const number = sortedNumbers[index].number;
        if (!dragSelectedRows.includes(number)) {
            setDragSelectedRows([number]);
        }
    };

    const handleMouseEnter = (index: number) => {
        if (isDragging && dragStartIndex !== null) {
            const start = Math.min(dragStartIndex, index);
            const end = Math.max(dragStartIndex, index);
            const selected = sortedNumbers
                .slice(start, end + 1)
                .map(row => row.number);
            setDragSelectedRows(selected);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDragStartIndex(null);
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
        const rowsText = sortedNumbers.map((row) =>
            headers.map((h) => row[h.key]).join("\t")
        );
        const textToCopy = [`Voici le tableau de statistiques actuelles des Numéros:`, headerLine, ...rowsText].join("\n");
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };

    // Gestionnaire pour les changements de filtres
    const handleIntervalFilterChange = (category: keyof FilterOptions, label: string) => {
        setSelectedFilters(prev => {
            const current = prev[category]?.intervals || [];
            const updated = current.includes(label)
                ? current.filter(l => l !== label)
                : [...current, label];

            return {
                ...prev,
                [category]: {
                    ...prev[category],
                    intervals: updated.length > 0 ? updated : undefined
                }
            };
        });
    };

    const handleIndividualFilterChange = (category: keyof FilterOptions, label: string) => {
        setSelectedFilters(prev => {
            const current = prev[category]?.individual || [];
            const updated = current.includes(label)
                ? current.filter(l => l !== label)
                : [...current, label];

            return {
                ...prev,
                [category]: {
                    ...prev[category],
                    individual: updated.length > 0 ? updated : undefined
                }
            };
        });
    };

    // Réinitialiser tous les filtres
    const clearAllFilters = () => {
        setSelectedFilters({});
    };

    // Déterminer la couleur de fond
    const getRowBackground = (number: string) => {
        if (selectedRows.includes(number)) {
            return "bg-yellow-300";
        }
        if (dragSelectedRows.includes(number)) {
            return "bg-cyan-100";
        }
        return "hover:bg-gray-50";
    };

    // Composant de filtre pour une catégorie
    const FilterCategory = ({ title, category, options }: {
        title: string;
        category: keyof FilterOptions;
        options: FilterCategory;
    }) => {
        if (!options) return null;

        const hasIntervals = options.intervals && options.intervals.length > 0;
        const hasIndividual = options.individual && options.individual.length > 0;

        // Définir la hauteur en fonction du nombre d'éléments
        const getMaxHeight = (itemCount: number) => {
            if (itemCount <= 5) return "max-h-32"; // Hauteur fixe pour peu d'éléments
            if (itemCount <= 10) return "max-h-48";
            return "max-h-64";
        };

        return (
            <div className="mb-4 border border-gray-200 rounded p-2">
                <h4 className="font-semibold text-sm mb-2 bg-gray-100 p-1 rounded">{title}</h4>

                {/* Filtres par intervalles */}
                {hasIntervals && (
                    <div className={hasIndividual ? "mb-3" : ""}>
                        <h5 className="text-xs font-medium text-gray-600 mb-1">Par intervalles:</h5>
                        <div className={`space-y-1 ${getMaxHeight(options.intervals!.length)} overflow-y-auto`}>
                            {options.intervals!.map(option => (
                                <label key={`interval-${option.label}`} className="flex items-center space-x-2 text-sm hover:bg-gray-100 p-1 rounded">
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters[category]?.intervals?.includes(option.label) || false}
                                        onChange={() => handleIntervalFilterChange(category, option.label)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="font-medium">{option.label}</span>
                                    {option.display_range && (
                                        <span className="text-gray-500 text-xs ml-1">({option.display_range})</span>
                                    )}
                                    <span className="text-gray-500 text-xs ml-auto">({option.count})</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Filtres individuels */}
                {hasIndividual && (
                    <div>
                        <h5 className="text-xs font-medium text-gray-600 mb-1">Valeurs individuelles:</h5>
                        <div className={`space-y-1 ${getMaxHeight(options.individual!.length + 10)} overflow-y-auto`}>
                            {options.individual!.map(option => (
                                <label key={`ind-${option.label}`} className="flex items-center space-x-2 text-sm hover:bg-gray-100 p-1 rounded">
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters[category]?.individual?.includes(option.label) || false}
                                        onChange={() => handleIndividualFilterChange(category, option.label)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="font-medium">{option.label}</span>
                                    <span className="text-gray-500 text-xs ml-auto">({option.count})</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-4">
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
                    {data && (
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-3 py-1 rounded font-semibold text-white ${showFilters ? "bg-orange-600 hover:bg-orange-700" : "bg-purple-600 hover:bg-purple-700"}`}
                        >
                            {showFilters ? "Masquer filtres" : "Afficher filtres"}
                        </button>
                    )}
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

            {/* Panneau de filtres */}
            {data && showFilters && filterOptions && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-lg">Filtres avancés</h3>
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Réinitialiser tous les filtres
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FilterCategory title="Fréquence" category="frequency" options={filterOptions.frequency} />
                        <FilterCategory title="Retard" category="delay" options={filterOptions.delay} />
                        <FilterCategory title="Progression" category="progression" options={filterOptions.progression} />
                        <FilterCategory title="Fréq_Récente" category="recent_frequency" options={filterOptions.recent_frequency} />
                        <FilterCategory title="Fréq_Période_Préc" category="frequency_previous_period" options={filterOptions.frequency_previous_period} />
                        <FilterCategory title="Sorties" category="sorties" options={filterOptions.sorties} />
                        <FilterCategory title="Ecart" category="ecart" options={filterOptions.ecart} />
                        <FilterCategory title="Rapport_moyen" category="rapport_moyen" options={filterOptions.rapport_moyen} />
                    </div>

                    {Object.keys(selectedFilters).length > 0 && (
                        <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                            <span className="font-semibold">Filtres actifs: </span>
                            {Object.entries(selectedFilters).map(([key, filters]) => (
                                <div key={key} className="ml-2">
                                    <span className="font-medium">{key}:</span>
                                    {filters?.intervals && filters.intervals.length > 0 && (
                                        <span className="mr-2 text-blue-700"> intervalles: {filters.intervals.join(', ')}</span>
                                    )}
                                    {filters?.individual && filters.individual.length > 0 && (
                                        <span className="text-green-700"> valeurs: {filters.individual.join(', ')}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Tableau des résultats */}
            {data && (
                <>
                    <div className="mb-2 text-blue-600 flex justify-between">
                        <div>
                            <strong>Tirage:</strong> {data._id}
                        </div>
                        <div>
                            <strong>Résultats:</strong> {sortedNumbers.length} / {data.numbers.length}
                        </div>
                    </div>
                    <div
                        ref={tableRef}
                        className="overflow-x-auto border border-gray-300 rounded"
                        onMouseLeave={() => {
                            if (isDragging) {
                                setIsDragging(false);
                                setDragStartIndex(null);
                            }
                        }}
                    >
                        <table className="min-w-[900px] w-full border-collapse">
                            <thead>
                            <tr className="bg-gray-100">
                                {headers.map(({ label, key }) => (
                                    <th
                                        key={key}
                                        className="border border-gray-300 px-3 py-2 text-center cursor-pointer hover:bg-gray-200"
                                        onClick={() => requestSort(key)}
                                    >
                                        {label} {sortConfig?.key === key ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {sortedNumbers.map((row, index) => (
                                <tr
                                    key={row.number}
                                    onDoubleClick={() => handleDoubleClick(row.number)}
                                    onMouseDown={() => handleMouseDown(index)}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseUp={handleMouseUp}
                                    className={`
                                        ${getRowBackground(row.number)}
                                        ${isDragging ? "cursor-crosshair" : "cursor-default"}
                                        select-none
                                    `}
                                >
                                    <td className="border border-gray-300 px-2 py-1 text-center font-medium">{row.number}</td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">{row.frequency}</td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">{row.delay}</td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">{row.progression}</td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">{row.recent_frequency}</td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">{row.frequency_previous_period}</td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">{row.sorties}</td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">{row.ecart}</td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">{row.rapport_moyen}</td>
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

export default Numbers;