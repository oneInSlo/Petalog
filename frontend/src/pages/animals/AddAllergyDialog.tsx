import { z } from "zod";
import { Btn } from "../../components/ui/Btn";
import { Dialog } from "../../components/ui/Dialog";
import { Field } from "../../components/ui/Field";
import { Note } from "../../components/ui/Note";
import { api } from "../../lib/api";
import { useForm } from "../../lib/useForm";

const allergySchema = z.object({
  allergen: z.string().trim().min(1, "Alergen je obvezen"),
  description: z.string(),
});

export function AddAllergyDialog({
  animalId,
  onClose,
  onAdded,
}: {
  animalId: number;
  onClose: () => void;
  onAdded: () => void;
}) {
  const { field, formError, submitting, handleSubmit } = useForm(
    allergySchema,
    { allergen: "", description: "" },
    async (values) => {
      await api(`/animals/${animalId}/allergies`, { method: "POST", body: values });
      onAdded();
    },
  );

  return (
    <Dialog title="Dodaj alergijo" onClose={onClose}>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
        {formError && <Note tone="bad">{formError}</Note>}
        <Field label="Alergen" autoComplete="off" {...field("allergen")} />
        <Field label="Opis reakcije (neobvezno)" autoComplete="off" {...field("description")} />
        <div className="flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>
            Prekliči
          </Btn>
          <Btn type="submit" disabled={submitting}>
            Dodaj alergijo
          </Btn>
        </div>
      </form>
    </Dialog>
  );
}
