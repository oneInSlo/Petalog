import { z } from "zod";
import { Btn } from "../../components/ui/Btn";
import { Dialog } from "../../components/ui/Dialog";
import { Field } from "../../components/ui/Field";
import { Note } from "../../components/ui/Note";
import { SelectField } from "../../components/ui/SelectField";
import { sexLabels, speciesLabels, type Animal } from "../../lib/animals";
import { api } from "../../lib/api";
import { useForm } from "../../lib/useForm";

// The date of birth and microchip rules live in the backend and come back as field errors
const animalSchema = z.object({
  name: z.string().trim().min(1, "Ime je obvezno"),
  species: z.string().min(1, "Vrsta je obvezna"),
  sex: z.string().min(1, "Spol je obvezen"),
  breed: z.string(),
  dateOfBirth: z.string(),
  microchipNumber: z.string(),
});

function toOptions(labels: Record<string, string>) {
  return [
    { value: "", label: "Izberite ..." },
    ...Object.entries(labels).map(([value, label]) => ({ value, label })),
  ];
}

const speciesOptions = toOptions(speciesLabels);
const sexOptions = toOptions(sexLabels);

export function AnimalDialog({
  animal,
  onClose,
  onSaved,
}: {
  animal: Animal | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { field, formError, submitting, handleSubmit } = useForm(
    animalSchema,
    {
      name: animal?.name ?? "",
      species: animal?.species ?? "",
      sex: animal?.sex ?? "",
      breed: animal?.breed ?? "",
      dateOfBirth: animal?.dateOfBirth ?? "",
      microchipNumber: animal?.microchipNumber ?? "",
    },
    async (values) => {
      await api(animal ? `/animals/${animal.id}` : "/animals", {
        method: animal ? "PUT" : "POST",
        body: values,
      });
      onSaved();
    },
  );

  return (
    <Dialog title={animal ? "Uredi žival" : "Dodaj žival"} onClose={onClose}>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
        {formError && <Note tone="bad">{formError}</Note>}
        <Field label="Ime" autoComplete="off" {...field("name")} />
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-4">
          <SelectField
            className="flex-1"
            label="Vrsta"
            options={speciesOptions}
            {...field("species")}
          />
          <SelectField className="flex-1" label="Spol" options={sexOptions} {...field("sex")} />
        </div>
        <Field label="Pasma (neobvezno)" autoComplete="off" {...field("breed")} />
        <Field label="Datum rojstva (neobvezno)" type="date" {...field("dateOfBirth")} />
        <Field
          label="Številka čipa (neobvezno)"
          inputMode="numeric"
          autoComplete="off"
          hint="15 števk"
          {...field("microchipNumber")}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>
            Prekliči
          </Btn>
          <Btn type="submit" disabled={submitting}>
            {animal ? "Shrani" : "Dodaj žival"}
          </Btn>
        </div>
      </form>
    </Dialog>
  );
}
