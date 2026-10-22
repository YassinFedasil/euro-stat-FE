import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, History as HistoryIcon, RefreshCw } from "lucide-react";
import { Link } from "react-router";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import Button from "../components/ui/button/Button";
import { NumberBall, StarBall } from "../components/euromillions/Balls";
import { ApiError } from "../services/api";
import { getHistory, getHistoryDraw } from "../services/historyService";
import type { HistoryDraw, HistoryList } from "../services/historyService";

function describeError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      return "Aucun détail disponible pour ce tirage.";
    }
    if (error.status === 0 || error.status >= 500) {
      return "⚠️ Le serveur est momentanément indisponible. Réessayez dans quelques instants.";
    }
  }
  return fallback;
}

export default function History() {
  const [history, setHistory] = useState<HistoryList | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [draw, setDraw] = useState<HistoryDraw | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const cacheRef = useRef(new Map<string, HistoryDraw>());

  const loadHistory = useCallback(async () => {
    setLoadingList(true);
    setListError(null);
    try {
      const data = await getHistory();
      cacheRef.current.clear();
      setHistory(data);
      setIndex(0);
    } catch (error) {
      setListError(describeError(error, "Impossible de charger l'historique des tirages."));
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const total = history?.total ?? 0;
  const current = history?.items[index];

  useEffect(() => {
    if (!current) {
      setDraw(null);
      return;
    }

    const cached = cacheRef.current.get(current.date);
    if (cached) {
      setDraw(cached);
      setDetailError(null);
      setLoadingDetail(false);
      return;
    }

    let cancelled = false;
    setDraw(null);
    setDetailError(null);
    setLoadingDetail(true);

    getHistoryDraw(current.date)
      .then((data) => {
        if (cancelled) return;
        cacheRef.current.set(current.date, data);
        setDraw(data);
      })
      .catch((error) => {
        if (cancelled) return;
        setDetailError(describeError(error, "Impossible de charger ce tirage."));
      })
      .finally(() => {
        if (!cancelled) setLoadingDetail(false);
      });

    return () => {
      cancelled = true;
    };
  }, [current]);

  const officialNumbers = new Set(draw?.official?.numbers ?? []);
  const officialStars = new Set(draw?.official?.stars ?? []);
  const hasPrevious = total > 0 && index < total - 1;
  const hasNext = total > 0 && index > 0;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageMeta
        title="Historique — EuroMillions"
        description="Comparez les combinaisons enregistrées avec les résultats officiels des tirages EuroMillions."
      />

      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
            <HistoryIcon className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-title-sm font-bold text-gray-800 dark:text-white/90">Historique des tirages</h1>
            <p className="text-theme-sm text-gray-500 dark:text-gray-400">
              Résultats officiels et combinaisons enregistrées
            </p>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => hasPrevious && setIndex((value) => value + 1)}
            disabled={!hasPrevious}
            startIcon={<ChevronLeft className="h-4 w-4" />}
          >
            Tirage précédent
          </Button>

          <div className="text-center">
            {current ? (
              <>
                <p className="text-base font-semibold text-gray-800 dark:text-white/90">{current.date}</p>
                <p className="text-theme-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  Tirage {index + 1} sur {total}
                </p>
              </>
            ) : (
              <p className="text-theme-sm text-gray-500 dark:text-gray-400">—</p>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => hasNext && setIndex((value) => value - 1)}
            disabled={!hasNext}
            endIcon={<ChevronRight className="h-4 w-4" />}
          >
            Tirage suivant
          </Button>
        </div>
      </div>

      {loadingList && (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center text-theme-sm text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
          Chargement de l'historique…
        </div>
      )}

      {!loadingList && listError && (
        <div className="rounded-2xl border border-error-200 bg-error-50 px-6 py-6 text-center dark:border-error-500/30 dark:bg-error-500/10">
          <p className="text-theme-sm font-medium text-error-700 dark:text-error-400">{listError}</p>
          <button
            onClick={() => void loadHistory()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-theme-sm font-semibold text-gray-700 ring-1 ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700"
          >
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </button>
        </div>
      )}

      {!loadingList && !listError && total === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            Aucun tirage n'est disponible dans l'historique pour le moment.
          </p>
          <Link to="/" className="mt-4 inline-block text-theme-sm font-semibold text-brand-500 hover:text-brand-600">
            Générer des combinaisons
          </Link>
        </div>
      )}

      {!loadingList && !listError && current && (
        <div className="space-y-6">
          <ComponentCard
            title="Résultat officiel"
            desc={
              draw?.official
                ? "Numéros et étoiles réellement tirés (source : résultats officiels déjà extraits dans l'application)."
                : "Aucun résultat officiel confirmé n'est disponible pour cette date."
            }
          >
            {loadingDetail && !draw && (
              <p className="text-theme-sm text-gray-500 dark:text-gray-400">Chargement du tirage…</p>
            )}

            {!loadingDetail && detailError && (
              <p className="text-theme-sm font-medium text-error-600 dark:text-error-400">{detailError}</p>
            )}

            {draw?.official && (
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-theme-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Numéros gagnants
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {draw.official.numbers.map((number, position) => (
                      <NumberBall key={number} number={number} delay={position * 60} compact />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-theme-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Étoiles gagnantes
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {draw.official.stars.map((star, position) => (
                      <StarBall key={star} number={star} delay={position * 60} compact />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!loadingDetail && !detailError && !draw?.official && (
              <div className="rounded-xl border border-warning-300 bg-warning-50 px-4 py-3 text-theme-sm font-medium text-warning-800 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-300">
                ⚠️ Résultat officiel indisponible pour le tirage du {current.date}. Aucun gain ne peut être validé
                tant que le résultat officiel n'est pas confirmé.
              </div>
            )}
          </ComponentCard>

          <ComponentCard
            title="Combinaisons enregistrées"
            desc="Comparaison automatique avec le résultat officiel — les valeurs gagnantes sont surlignées en vert."
          >
            {loadingDetail && !draw && (
              <p className="text-theme-sm text-gray-500 dark:text-gray-400">Chargement des combinaisons…</p>
            )}

            {!loadingDetail && detailError && (
              <p className="text-theme-sm font-medium text-error-600 dark:text-error-400">{detailError}</p>
            )}

            {draw && draw.combinations.length === 0 && (
              <div className="space-y-2">
                <p className="text-theme-sm text-gray-500 dark:text-gray-400">
                  Aucune combinaison enregistrée pour ce tirage.
                </p>
                <Link to="/" className="inline-block text-theme-sm font-semibold text-brand-500 hover:text-brand-600">
                  Générer et enregistrer des combinaisons pour le {current.date}
                </Link>
              </div>
            )}

            {draw && draw.combinations.length > 0 && (
              <ul className="space-y-3">
                {draw.combinations.map((combination) => {
                  const hasOfficial = Boolean(draw.official);
                  return (
                    <li
                      key={combination.index}
                      className="rounded-xl border border-gray-200 px-3 py-3 dark:border-gray-700"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-extrabold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                          {combination.index}
                        </span>

                        <div className="flex flex-wrap items-center gap-2">
                          {combination.numbers.map((number) => (
                            <NumberBall
                              key={number}
                              number={number}
                              compact
                              highlighted={hasOfficial && officialNumbers.has(number)}
                            />
                          ))}
                          {combination.stars.map((star) => (
                            <StarBall
                              key={star}
                              number={star}
                              compact
                              highlighted={hasOfficial && officialStars.has(star)}
                            />
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                          {hasOfficial ? (
                            <>
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-theme-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                {combination.matched_numbers}/5 numéros
                              </span>
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-theme-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                {combination.matched_stars}/2 étoiles
                              </span>
                            </>
                          ) : (
                            <span className="rounded-full bg-warning-50 px-3 py-1 text-theme-xs font-semibold text-warning-700 dark:bg-warning-500/10 dark:text-warning-300">
                              En attente du résultat officiel
                            </span>
                          )}
                        </div>
                      </div>

                      {combination.is_jackpot && hasOfficial && (
                        <div className="mt-3 rounded-lg bg-emerald-500 px-4 py-3 text-center text-theme-sm font-bold text-white shadow-theme-md">
                          🎉 C'est chouette, tu as gagné le jackpot !
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            {draw && draw.combinations.length > 0 && (
              <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                Les combinaisons enregistrées sont des propositions statistiques et non des prédictions garanties.
              </p>
            )}
          </ComponentCard>
        </div>
      )}
    </div>
  );
}
