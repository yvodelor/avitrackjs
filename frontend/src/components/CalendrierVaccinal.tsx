
import { useMemo } from "react";
import {
  CheckCircle2,
  Clock3,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

import { type Vaccin } from "@/api/vaccin.api";
import { type Vaccination } from "@/api/vaccination.api";

interface CalendrierVaccinalProps {
  programmeVaccins: Vaccin[];
  vaccinationsRealisees: Vaccination[];
  dateInitial: string;
  nomBatiment: string;
  nomCategorie?: string;
  nomSouche?: string;
}

type EtatVaccin = "effectue" | "a_faire" | "en_retard";

interface LigneVaccinale {
  vaccin: Vaccin;
  datesPossibles: Date[];
  datesRealisees: Date[];
  etat: EtatVaccin;
}

/**
 * Convertit une date en objet Date local.
 * Évite les décalages de fuseau horaire pour YYYY-MM-DD.
 */
const parseDate = (value: string | null | undefined): Date | null => {
  if (!value || !value.trim()) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (match) {
    const annee = Number(match[1]);
    const mois = Number(match[2]) - 1;
    const jour = Number(match[3]);

    const date = new Date(annee, mois, jour);

    // Vérifie que la date existe réellement.
    if (
      date.getFullYear() !== annee ||
      date.getMonth() !== mois ||
      date.getDate() !== jour
    ) {
      return null;
    }

    return date;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  // Normalise les heures sans modifier le jour local de la date.
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
};

const ajouterJours = (date: Date, jours: number): Date => {
  const resultat = new Date(date);
  resultat.setDate(resultat.getDate() + jours);
  return resultat;
};

const formaterDate = (date: Date): string =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

const formaterDatesPossibles = (dates: Date[]): string => {
  if (dates.length === 0) return "—";

  return dates
    .map((date) =>
      new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
      }).format(date)
    )
    .join(", ");
};

const etatLabel: Record<EtatVaccin, string> = {
  effectue: "Effectué",
  a_faire: "À faire",
  en_retard: "En retard",
};

const etatStyle: Record<EtatVaccin, string> = {
  effectue: "bg-emerald-100 text-emerald-800",
  a_faire: "bg-amber-100 text-amber-800",
  en_retard: "bg-red-100 text-red-800",
};

function EtatBadge({ etat }: { etat: EtatVaccin }) {
  const Icon =
    etat === "effectue"
      ? CheckCircle2
      : etat === "en_retard"
        ? AlertCircle
        : Clock3;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${etatStyle[etat]}`}
    >
      <Icon size={14} />
      {etatLabel[etat]}
    </span>
  );
}

export default function CalendrierVaccinal({
  programmeVaccins,
  vaccinationsRealisees,
  dateInitial,
  nomBatiment,
  nomCategorie,
  nomSouche,
}: CalendrierVaccinalProps) {
  const lignes = useMemo<LigneVaccinale[]>(() => {
    const debut = parseDate(dateInitial);

    if (!debut) return [];

    const aujourdHui = new Date();
    aujourdHui.setHours(0, 0, 0, 0);

    return programmeVaccins
      .map((vaccin): LigneVaccinale | null => {
        const ageMin = Number(vaccin.age_min);
        const ageMax = Number(vaccin.age_max);

        // Ignore les programmes avec des âges invalides.
        if (
          !Number.isFinite(ageMin) ||
          !Number.isFinite(ageMax) ||
          ageMin < 0 ||
          ageMax < ageMin
        ) {
          return null;
        }

        const premierJour = Math.ceil(ageMin);
        const dernierJour = Math.floor(ageMax);

        const datesPossibles: Date[] = [];

        for (let age = premierJour; age <= dernierJour; age++) {
          datesPossibles.push(ajouterJours(debut, age));
        }

        const datesRealisees = vaccinationsRealisees
          .filter((realisation) => {
            // Normalise les identifiants numériques.
            const memeVaccin =
              Number(realisation.vaccin_id) === Number(vaccin.id);

            // Une réalisation sans date n'est pas considérée effectuée.
            return memeVaccin && Boolean(parseDate(realisation.date));
          })
          .map((realisation) => parseDate(realisation.date)!)
          .sort((a, b) => a.getTime() - b.getTime());

        const dateMax = ajouterJours(debut, dernierJour);

        let etat: EtatVaccin;

        if (datesRealisees.length > 0) {
          etat = "effectue";
        } else if (aujourdHui.getTime() > dateMax.getTime()) {
          etat = "en_retard";
        } else {
          etat = "a_faire";
        }

        return {
          vaccin,
          datesPossibles,
          datesRealisees,
          etat,
        };
      })
      .filter((ligne): ligne is LigneVaccinale => ligne !== null)
      .sort((a, b) => {
        const dateA = a.datesPossibles[0]?.getTime() ?? Infinity;
        const dateB = b.datesPossibles[0]?.getTime() ?? Infinity;

        return dateA - dateB;
      });
  }, [programmeVaccins, vaccinationsRealisees, dateInitial]);

  const compteurs = useMemo(
    () => ({
      total: lignes.length,
      effectues: lignes.filter(
        (ligne) => ligne.etat === "effectue"
      ).length,
      enRetard: lignes.filter(
        (ligne) => ligne.etat === "en_retard"
      ).length,
      aFaire: lignes.filter(
        (ligne) => ligne.etat === "a_faire"
      ).length,
    }),
    [lignes]
  );

  if (!parseDate(dateInitial)) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Une date de mise en place valide est nécessaire pour
        calculer les dates de vaccination.
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="text-emerald-700" size={24} />
            <h2 className="text-xl font-bold text-gray-900">
              Calendrier vaccinal
            </h2>
          </div>

          <p className="mt-2 text-sm text-gray-600">
            Bâtiment : <strong>{nomBatiment}</strong>
            {nomCategorie && <> · Catégorie : {nomCategorie}</>}
            {nomSouche && <> · Souche : {nomSouche}</>}
          </p>
        </div>

        <span className="text-xs text-gray-500">
          Mise en place : {formaterDate(parseDate(dateInitial)!)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">Vaccins prévus</p>
          <p className="mt-1 text-2xl font-bold">
            {compteurs.total}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm text-emerald-800">Effectués</p>
          <p className="mt-1 text-2xl font-bold text-emerald-800">
            {compteurs.effectues}
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">À faire</p>
          <p className="mt-1 text-2xl font-bold text-amber-800">
            {compteurs.aFaire}
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">En retard</p>
          <p className="mt-1 text-2xl font-bold text-red-800">
            {compteurs.enRetard}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-[850px] border-collapse text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3">Vaccin</th>
              <th className="px-4 py-3">Âge</th>
              <th className="px-4 py-3">Dates possibles</th>
              <th className="px-4 py-3">État</th>
              <th className="px-4 py-3">Dates réalisées</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {lignes.map((ligne) => (
              <tr
                key={ligne.vaccin.id}
                className="transition hover:bg-gray-50"
              >
                <td className="px-4 py-4">
                  <div className="font-semibold text-gray-900">
                    {ligne.vaccin.name ||
                      `Vaccin #${ligne.vaccin.id}`}
                  </div>

                  {ligne.vaccin.optional && (
                    <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      Facultatif
                    </span>
                  )}

                  {ligne.vaccin.remarque && (
                    <p className="mt-1 max-w-xs text-xs text-gray-500">
                      {ligne.vaccin.remarque}
                    </p>
                  )}
                </td>

                <td className="whitespace-nowrap px-4 py-4 text-gray-700">
                  {ligne.vaccin.age_min === ligne.vaccin.age_max
                    ? `J${ligne.vaccin.age_min}`
                    : `J${ligne.vaccin.age_min}–J${ligne.vaccin.age_max}`}
                </td>

                <td className="px-4 py-4 text-gray-700">
                  <div className="max-w-sm">
                    {formaterDatesPossibles(ligne.datesPossibles)}
                  </div>
                </td>

                <td className="px-4 py-4">
                  <EtatBadge etat={ligne.etat} />
                </td>

                <td className="px-4 py-4 text-gray-700">
                  {ligne.datesRealisees.length > 0
                    ? ligne.datesRealisees
                        .map(formaterDate)
                        .join(", ")
                    : "—"}
                </td>
              </tr>
            ))}

            {lignes.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  Aucun vaccin valide dans le programme sélectionné.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
