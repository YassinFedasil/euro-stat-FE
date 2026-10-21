type OccurrencesBadgeProps = {
    count: number;
    /** Nombre réel de tirages analysés (0 = pourcentage masqué). */
    total: number;
    /** Classes de style du badge (varient selon la page / la section). */
    className?: string;
};

/**
 * Badge d'occurrences : « 6 fois (24 %) » — le pourcentage est en vert,
 * arrondi à l'entier le plus proche, et masqué si `total` vaut 0
 * (aucun tirage analysé → pas de division par zéro).
 */
export default function OccurrencesBadge({
    count,
    total,
    className = "",
}: OccurrencesBadgeProps) {
    const percentage = total > 0 ? Math.round((count / total) * 100) : null;

    return (
        <span className={`shrink-0 whitespace-nowrap ${className}`}>
            {count} fois
            {percentage !== null && (
                <span className="text-green-600"> ({percentage} %)</span>
            )}
        </span>
    );
}
