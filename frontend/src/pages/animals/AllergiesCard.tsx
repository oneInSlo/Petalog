import { AlertTriangle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Btn } from "../../components/ui/Btn";
import { Card } from "../../components/ui/Card";
import { Note } from "../../components/ui/Note";
import type { Allergy } from "../../lib/allergies";
import { api } from "../../lib/api";
import { AddAllergyDialog } from "./AddAllergyDialog";

export function AllergiesCard({
  animalId,
  canAdd,
}: {
  animalId: number;
  canAdd: boolean;
}) {
  const [allergies, setAllergies] = useState<Allergy[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setError(null);

    api<{ allergies: Allergy[] }>(`/animals/${animalId}/allergies`)
      .then((data) => {
        if (!cancelled) setAllergies(data.allergies);
      })
      .catch((caught: Error) => {
        if (!cancelled) setError(caught.message);
      });

    return () => {
      cancelled = true;
    };
  }, [animalId, reloadCount]);

  function handleAdded() {
    setAdding(false);
    setReloadCount((count) => count + 1);
  }

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-[17px] font-bold text-foreground">Alergije</h3>
        {canAdd && (
          <Btn variant="secondary" size="sm" icon={Plus} onClick={() => setAdding(true)}>
            Dodaj alergijo
          </Btn>
        )}
      </div>
      {error && <Note tone="bad">{error}</Note>}
      {allergies === null && !error && <p className="text-muted-foreground">Nalaganje ...</p>}
      {allergies?.length === 0 && (
        <p className="text-[14px] text-muted-foreground">Ni zabeleženih alergij</p>
      )}
      {allergies && allergies.length > 0 && (
        <ul className="flex flex-col gap-2">
          {allergies.map((allergy) => (
            <li key={allergy.id} className="flex flex-wrap items-center gap-2">
              <Badge tone="bad">
                <AlertTriangle size={13} />
                {allergy.allergen}
              </Badge>
              {allergy.description && (
                <span className="min-w-0 break-words text-[14px] text-muted-foreground">
                  {allergy.description}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      {adding && (
        <AddAllergyDialog
          animalId={animalId}
          onClose={() => setAdding(false)}
          onAdded={handleAdded}
        />
      )}
    </Card>
  );
}
