export type Allergy = {
  id: number;
  allergen: string;
  description: string | null;
};

export function formatAllergy({ allergen, description }: Allergy) {
  return description ? `${allergen} – ${description}` : allergen;
}
