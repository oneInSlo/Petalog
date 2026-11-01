import { AlertTriangle, ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { AnimalAvatar } from "../../components/ui/AnimalAvatar";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import type { Allergy } from "../../lib/allergies";
import { describeAnimal, type Animal } from "../../lib/animals";
import { Timeline } from "../animals/Timeline";

/** On narrow screens the record comes before the history, so the form stays close to the top. */
export function RecordLayout({
  animal,
  allergies,
  historyKey,
  children,
}: {
  animal: Animal;
  allergies: Allergy[];
  historyKey?: string;
  children: ReactNode;
}) {
  return (
    <>
      <Link
        to={`/animals/${animal.id}`}
        className="flex items-center gap-2 self-start text-[14px] font-semibold text-primary"
      >
        <ArrowLeft size={16} />
        Nazaj na karton
      </Link>
      <div className="grid items-start gap-4 md:gap-6 xl:grid-cols-[340px_minmax(0,1fr)] xl:grid-rows-[auto_1fr]">
        <Card>
          <div className="flex items-center gap-3">
            <AnimalAvatar name={animal.name} species={animal.species} size={52} />
            <div className="flex min-w-0 flex-col">
              <span className="break-words font-display text-[22px] font-bold leading-tight">
                {animal.name}
              </span>
              <span className="text-[13px] text-muted-foreground">{describeAnimal(animal)}</span>
            </div>
          </div>
          {allergies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allergies.map((allergy) => (
                <Badge key={allergy.id} tone="bad">
                  <AlertTriangle size={13} />
                  {allergy.allergen}
                </Badge>
              ))}
            </div>
          )}
        </Card>
        <div className="min-w-0 xl:col-start-2 xl:row-span-2 xl:row-start-1">{children}</div>
        <Card title="Zgodovina">
          <Timeline key={historyKey} animalId={animal.id} canOpenRecords />
        </Card>
      </div>
    </>
  );
}
