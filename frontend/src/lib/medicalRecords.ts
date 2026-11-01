type Person = { id: number; firstName: string; lastName: string };

export type Addendum = {
  id: number;
  content: string;
  createdAt: string;
  author: Person;
};

export type MedicalRecord = {
  id: number;
  animalId: number;
  veterinarianId: number;
  anamnesis: string;
  diagnosis: string;
  therapy: string | null;
  status: "DRAFT" | "CLOSED";
  closedAt: string | null;
  createdAt: string;
  veterinarian: Person;
  addenda: Addendum[];
};

export function fullName({ firstName, lastName }: Person) {
  return `${firstName} ${lastName}`;
}
