import { Bird, Cat, Dog, PawPrint, Rabbit, Rat, Squirrel, type LucideIcon } from "lucide-react";
import type { Species } from "../../lib/animals";
import { cn } from "../../lib/utils";

const speciesStyles: Record<Species, { classes: string; icon: LucideIcon }> = {
  DOG: { classes: "bg-sp-dog text-primary", icon: Dog },
  CAT: { classes: "bg-sp-cat text-warn-fg", icon: Cat },
  RABBIT: { classes: "bg-sp-rabbit text-neutral-fg", icon: Rabbit },
  HAMSTER: { classes: "bg-sp-hamster text-warn-fg", icon: Squirrel },
  GUINEA_PIG: { classes: "bg-sp-guinea-pig text-bad-fg", icon: Rat },
  FERRET: { classes: "bg-sp-ferret text-neutral-fg", icon: PawPrint },
  BIRD: { classes: "bg-sp-bird text-primary", icon: Bird },
};

export function AnimalAvatar({
  name,
  species,
  size = 44,
}: {
  name: string;
  species: Species;
  size?: number;
}) {
  const { classes, icon: Icon } = speciesStyles[species];

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full font-display font-bold",
          classes,
        )}
        style={{ fontSize: size * 0.42 }}
      >
        {name[0]}
      </div>
      <div
        className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full border-2 border-card bg-card text-muted-foreground"
        style={{ width: size * 0.42, height: size * 0.42 }}
      >
        <Icon size={size * 0.26} />
      </div>
    </div>
  );
}
