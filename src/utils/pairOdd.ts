export type PairOddRow = {
    value: string;
    count: number;
};

export type PairOddLabels = {
    even: [string, string]; // [singulier, pluriel]
    odd: [string, string];
};

type PairOddBucket = {
    even: number;
    odd: number;
    count: number;
};

const plural = (n: number, singular: string, pluralForm: string) =>
    n <= 1 ? singular : pluralForm;

/**
 * Regroupe des tirages par répartition pair/impair.
 *
 * @param draws  Un tableau de valeurs par tirage (ex: les 5 numéros, ou les 2 étoiles).
 *               Un numéro est pair si `Number(v) % 2 === 0`, sinon impair.
 * @param labels Formes singulier/pluriel pour l'affichage (numéros ou étoiles).
 * @param limit  Nombre maximum de répartitions à retourner (ex : « Top X »).
 *               Toutes les répartitions sont retournées si omis.
 * @returns Les répartitions observées, triées par nombre d'occurrences
 *          décroissant, puis du plus grand nombre de pairs au plus faible
 *          en cas d'égalité.
 */
export function computePairOddDistribution(
    draws: (string | number)[][],
    labels: PairOddLabels,
    limit?: number
): PairOddRow[] {
    const buckets = new Map<string, PairOddBucket>();

    for (const values of draws) {
        if (!values || values.length === 0) continue;

        let even = 0;
        let odd = 0;
        for (const value of values) {
            if (Number(value) % 2 === 0) even += 1;
            else odd += 1;
        }

        const key = `${even}/${odd}`;
        const existing = buckets.get(key);
        if (existing) {
            existing.count += 1;
        } else {
            buckets.set(key, { even, odd, count: 1 });
        }
    }

    return [...buckets.values()]
        .sort((a, b) => (b.count - a.count) || (b.even - a.even))
        .slice(0, limit && limit > 0 ? limit : undefined)
        .map(
            (bucket) => ({
                value:
                    `${bucket.even} ${plural(bucket.even, labels.even[0], labels.even[1])}` +
                    ` / ${bucket.odd} ${plural(bucket.odd, labels.odd[0], labels.odd[1])}`,
                count: bucket.count,
            })
        );
}

export const NUMBER_PAIR_ODD_LABELS: PairOddLabels = {
    even: ["pair", "pairs"],
    odd: ["impair", "impairs"],
};

export const STAR_PAIR_ODD_LABELS: PairOddLabels = {
    even: ["paire", "paires"],
    odd: ["impaire", "impaires"],
};
