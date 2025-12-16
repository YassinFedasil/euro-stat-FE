// services/topXService.ts
export async function fetchTopNumbers(top: number, last: number) {
    const res = await fetch(
        `http://localhost:8000/api/charts/top?top=${top}&last=${last}`
    );

    if (!res.ok) {
        throw new Error("Failed to fetch top charts");
    }

    return res.json();
}

export async function fetchTopStars(top: number, last: number) {
    const res = await fetch(
        `http://localhost:8000/api/charts/top-stars?top=${top}&last=${last}`
    );

    if (!res.ok) {
        throw new Error("Erreur lors du chargement des stars");
    }

    return res.json();
}



