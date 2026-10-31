export type Species = "DOG" | "CAT" | "RABBIT" | "HAMSTER" | "GUINEA_PIG" | "FERRET" | "BIRD";
export type Sex = "MALE" | "FEMALE" | "UNKNOWN";

export type Animal = {
  id: number;
  name: string;
  species: Species;
  breed: string | null;
  sex: Sex;
  dateOfBirth: string | null;
  age: { years: number; months: number } | null;
  microchipNumber: string | null;
  canDelete: boolean;
};

export const speciesLabels: Record<Species, string> = {
  DOG: "Pes",
  CAT: "Mačka",
  RABBIT: "Zajec",
  HAMSTER: "Hrček",
  GUINEA_PIG: "Morski prašiček",
  FERRET: "Dihur",
  BIRD: "Ptica",
};

export const sexLabels: Record<Sex, string> = {
  MALE: "Samec",
  FEMALE: "Samica",
  UNKNOWN: "Neznano",
};

// Slovene nouns have separate forms for 1, 2, 3-4 and all other counts, decided by the last two digits
function pluralize(count: number, [one, two, few, many]: [string, string, string, string]) {
  const lastTwoDigits = count % 100;
  if (lastTwoDigits === 1) return `${count} ${one}`;
  if (lastTwoDigits === 2) return `${count} ${two}`;
  if (lastTwoDigits === 3 || lastTwoDigits === 4) return `${count} ${few}`;
  return `${count} ${many}`;
}

export function formatAge(age: Animal["age"]) {
  if (!age) return "Ni podatka";
  if (age.years > 0) return pluralize(age.years, ["leto", "leti", "leta", "let"]);
  if (age.months > 0) return pluralize(age.months, ["mesec", "meseca", "meseci", "mesecev"]);
  return "Manj kot mesec";
}
