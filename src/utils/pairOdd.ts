export type SplitRow = {
    value: string;
    count: number;
};

export type SplitLabels = {
    first: [string, string]; // [singulier, pluriel]
    second: [string, string];
};

/** Classe une valeur dans la 1re case (0), la 2e case (1), ou null (ignorée). */
type SplitClassifier = (value: string | number) => 0 | 1 | null;

type SplitBucket = {
    first: number;
    second: number;
    count: number;
};

const plural = (n: number, singular: string, pluralForm: string) =>
    n <= 1 ? singular : pluralForm;

/**
 * Regroupe des tirages par répartition de deux cases complémentaires.
 *
 * @param draws    Un tableau de valeurs par tirage (ex: les 5 numéros, ou les 2 étoiles).
 * @param classify Renvoie 0 pour la 1re case, 1 pour la 2e, null pour ignorer la valeur.
 * @param labels   Formes singulier/pluriel pour l'affichage de chaque case.
 * @param limit    Nombre maximum de répartitions à retourner (ex : « Top X »).
 *                 Toutes les répartitions sont retournées si omis.
 * @returns Les répartitions observées, triées par nombre d'occurrences
 *          décroissant, puis du plus grand nombre de valeurs dans la 1re case
 *          au plus faible en cas d'égalité.
 */
export function computeSplitDistribution(
    draws: (string | number)[][],
    classify: SplitClassifier,
    labels: SplitLabels,
    limit?: number
): SplitRow[] {
    const buckets = new Map<string, SplitBucket>();

    for (const values of draws) {
        if (!values || values.length === 0) continue;

        let first = 0;
        let second = 0;
        for (const value of values) {
            const side = classify(value);
            if (side === 0) first += 1;
            else if (side === 1) second += 1;
        }
        if (first + second === 0) continue;

        const key = `${first}/${second}`;
        const existing = buckets.get(key);
        if (existing) {
            existing.count += 1;
        } else {
            buckets.set(key, { first, second, count: 1 });
        }
    }

    return [...buckets.values()]
        .sort((a, b) => (b.count - a.count) || (b.first - a.first))
        .slice(0, limit && limit > 0 ? limit : undefined)
        .map(
            (bucket) => ({
                value:
                    `${bucket.first} ${plural(bucket.first, labels.first[0], labels.first[1])}` +
                    ` / ${bucket.second} ${plural(bucket.second, labels.second[0], labels.second[1])}`,
                count: bucket.count,
            })
        );
}

const classifyEvenOdd: SplitClassifier = (value) =>
    Number(value) % 2 === 0 ? 0 : 1;

/**
 * Répartition pair/impair d'un tirage (même contrat que
 * {@link computeSplitDistribution} : tri par occurrences, `limit` = Top X).
 */
export function computePairOddDistribution(
    draws: (string | number)[][],
    labels: SplitLabels,
    limit?: number
): SplitRow[] {
    return computeSplitDistribution(draws, classifyEvenOdd, labels, limit);
}

const classifyInterval: SplitClassifier = (value) => {
    const n = Number(value);
    if (n >= 1 && n <= 25) return 0;
    if (n >= 26 && n <= 50) return 1;
    return null;
};

/** Répartition des numéros entre [1-25] et [26-50] par tirage. */
export function computeIntervalDistribution(
    draws: (string | number)[][],
    limit?: number
): SplitRow[] {
    return computeSplitDistribution(draws, classifyInterval, INTERVAL_SPLIT_LABELS, limit);
}

export const NUMBER_PAIR_ODD_LABELS: SplitLabels = {
    first: ["pair", "pairs"],
    second: ["impair", "impairs"],
};

export const STAR_PAIR_ODD_LABELS: SplitLabels = {
    first: ["paire", "paires"],
    second: ["impaire", "impaires"],
};

export const INTERVAL_SPLIT_LABELS: SplitLabels = {
    first: ["numéro entre 1 et 25", "numéros entre 1 et 25"],
    second: ["numéro entre 26 et 50", "numéros entre 26 et 50"],
};
