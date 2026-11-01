import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AnimalAvatar } from "../../components/ui/AnimalAvatar";
import { Card } from "../../components/ui/Card";
import { Note } from "../../components/ui/Note";
import { pluralize, speciesLabels, type AnimalSearchResult } from "../../lib/animals";
import { api } from "../../lib/api";
import { fullName } from "../../lib/medicalRecords";

const MIN_QUERY_LENGTH = 2;
const SEARCH_DELAY_MS = 300;

export function PatientSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimalSearchResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const term = query.trim();
  const isSearchable = term.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    setResults(null);
    setError(null);
    if (term.length < MIN_QUERY_LENGTH) return;

    let cancelled = false;
    const timer = setTimeout(() => {
      api<{ animals: AnimalSearchResult[] }>(`/animals/search?q=${encodeURIComponent(term)}`)
        .then((data) => {
          if (!cancelled) setResults(data.animals);
        })
        .catch((caught: Error) => {
          if (!cancelled) setError(caught.message);
        });
    }, SEARCH_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [term]);

  return (
    <Card title="Iskanje pacienta">
      <label className="flex h-12 items-center gap-2 rounded-md border-2 border-primary bg-card px-3">
        <Search size={18} className="shrink-0 text-primary" />
        <input
          type="search"
          aria-label="Iskanje pacienta"
          placeholder="Ime živali, lastnik ali številka čipa"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-[16px] font-semibold outline-none placeholder:font-normal placeholder:text-muted-foreground"
        />
      </label>

      {error && <Note tone="bad">{error}</Note>}
      {!isSearchable && (
        <p className="text-[14px] text-muted-foreground">Vnesite vsaj 2 znaka.</p>
      )}
      {isSearchable && results === null && !error && (
        <p className="text-[14px] text-muted-foreground">Iskanje ...</p>
      )}

      {results?.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral text-neutral-fg">
            <Search size={20} />
          </div>
          <span className="font-bold">Ni najdenih pacientov</span>
          <span className="text-[14px] text-muted-foreground">
            Preverite črkovanje ali iščite po lastniku ali številki čipa.
          </span>
        </div>
      )}

      {results && results.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[13px] text-muted-foreground">
            {pluralize(results.length, ["zadetek", "zadetka", "zadetki", "zadetkov"])}
          </span>
          {results.map((animal) => (
            <Link
              key={animal.id}
              to={`/animals/${animal.id}`}
              className="flex items-center gap-3 rounded-md border border-border p-3 hover:bg-primary-tint"
            >
              <AnimalAvatar name={animal.name} species={animal.species} size={40} />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="break-words font-bold">
                  {animal.name}{" "}
                  <span className="font-normal text-muted-foreground">
                    · {[speciesLabels[animal.species], animal.breed].filter(Boolean).join(", ")}
                  </span>
                </span>
                <span className="break-words text-[13px] text-muted-foreground">
                  {fullName(animal.owner)} ·{" "}
                  {animal.microchipNumber ? `Čip ${animal.microchipNumber}` : "Brez čipa"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
