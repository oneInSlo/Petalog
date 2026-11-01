import { FileText, PawPrint, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import { AnimalAvatar } from "../../components/ui/AnimalAvatar";
import { AppFrame } from "../../components/ui/AppFrame";
import { Btn } from "../../components/ui/Btn";
import { Card } from "../../components/ui/Card";
import { Note } from "../../components/ui/Note";
import { formatAge, sexLabels, speciesLabels, type Animal } from "../../lib/animals";
import { api } from "../../lib/api";
import { AnimalDialog } from "./AnimalDialog";
import { DeleteAnimalDialog } from "./DeleteAnimalDialog";

type EditState = { animal: Animal | null } | null;

function AnimalCard({
  animal,
  onEdit,
  onDelete,
}: {
  animal: Animal;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const navigate = useNavigate();
  const description = [speciesLabels[animal.species], animal.breed].filter(Boolean).join(" · ");

  return (
    <Card className="gap-5">
      <div className="flex items-center gap-4">
        <AnimalAvatar name={animal.name} species={animal.species} size={56} />
        <div className="flex min-w-0 flex-col">
          <span className="break-words font-display text-[20px] font-bold">{animal.name}</span>
          <span className="text-[14px] text-muted-foreground">{description}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-border pt-4 text-[14px]">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Starost</span>
          <span className="font-semibold">{formatAge(animal.age)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Spol</span>
          <span className="font-semibold">{sexLabels[animal.sex]}</span>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap justify-end gap-2">
        <Btn
          variant="secondary"
          size="sm"
          icon={FileText}
          onClick={() => navigate(`/animals/${animal.id}`)}
        >
          Karton
        </Btn>
        <Btn size="sm" icon={Pencil} onClick={onEdit}>
          Uredi
        </Btn>
        <Btn
          variant="dangerOutline"
          size="sm"
          icon={Trash2}
          disabled={!animal.canDelete}
          title={animal.canDelete ? undefined : "Živali z zdravstveno evidenco ni mogoče izbrisati"}
          onClick={onDelete}
        >
          Izbriši
        </Btn>
      </div>
    </Card>
  );
}

export function OwnerDashboardPage() {
  const { user } = useAuth();
  const [animals, setAnimals] = useState<Animal[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);
  const [editing, setEditing] = useState<EditState>(null);
  const [deleting, setDeleting] = useState<Animal | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);

    api<{ animals: Animal[] }>("/animals")
      .then((data) => {
        if (!cancelled) setAnimals(data.animals);
      })
      .catch((caught: Error) => {
        if (!cancelled) setError(caught.message);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadCount]);

  function reload() {
    setEditing(null);
    setDeleting(null);
    setReloadCount((count) => count + 1);
  }

  return (
    <AppFrame title="Nadzorna plošča">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-display text-[32px] font-bold leading-tight">
          Dober dan, {user?.firstName}
        </h2>
        {animals && animals.length > 0 && (
          <Btn variant="secondary" icon={Plus} onClick={() => setEditing({ animal: null })}>
            Dodaj žival
          </Btn>
        )}
      </div>

      {error && <Note tone="bad">{error}</Note>}
      {animals === null && !error && <p className="text-muted-foreground">Nalaganje ...</p>}

      {animals?.length === 0 && (
        <Card className="items-center gap-5 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-tint text-primary">
            <PawPrint size={28} />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-display text-[24px] font-bold">Dodajte svojo prvo žival</h3>
            <p className="max-w-[420px] text-muted-foreground">
              Ko dodate žival, boste lahko spremljali njen zdravstveni karton in cepljenja.
            </p>
          </div>
          <Btn icon={Plus} onClick={() => setEditing({ animal: null })}>
            Dodaj žival
          </Btn>
        </Card>
      )}

      {animals && animals.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {animals.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              onEdit={() => setEditing({ animal })}
              onDelete={() => setDeleting(animal)}
            />
          ))}
        </div>
      )}

      {editing && (
        <AnimalDialog animal={editing.animal} onClose={() => setEditing(null)} onSaved={reload} />
      )}
      {deleting && (
        <DeleteAnimalDialog
          animal={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={reload}
        />
      )}
    </AppFrame>
  );
}
