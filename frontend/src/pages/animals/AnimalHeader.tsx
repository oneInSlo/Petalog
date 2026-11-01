import { AnimalAvatar } from "../../components/ui/AnimalAvatar";
import { Card } from "../../components/ui/Card";
import { describeAnimal, type Animal } from "../../lib/animals";

export function AnimalHeader({ animal }: { animal: Animal }) {
  return (
    <Card className="gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <AnimalAvatar name={animal.name} species={animal.species} size={72} />
        <div className="flex min-w-0 flex-col">
          <span className="break-words font-display text-[28px] font-bold leading-tight">
            {animal.name}
          </span>
          <span className="text-[14px] text-muted-foreground">{describeAnimal(animal)}</span>
        </div>
      </div>
      {animal.microchipNumber && (
        <span className="text-[13px] text-muted-foreground">
          Mikročip: <span className="font-semibold text-foreground">{animal.microchipNumber}</span>
        </span>
      )}
    </Card>
  );
}
