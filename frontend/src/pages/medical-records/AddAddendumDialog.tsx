import { z } from "zod";
import { Btn } from "../../components/ui/Btn";
import { Dialog } from "../../components/ui/Dialog";
import { Note } from "../../components/ui/Note";
import { TextareaField } from "../../components/ui/TextareaField";
import { api } from "../../lib/api";
import { useForm } from "../../lib/useForm";

const addendumSchema = z.object({
  content: z.string().trim().min(1, "Vsebina dodatka je obvezna"),
});

export function AddAddendumDialog({
  recordId,
  onClose,
  onAdded,
}: {
  recordId: number;
  onClose: () => void;
  onAdded: () => void;
}) {
  const { field, formError, submitting, handleSubmit } = useForm(
    addendumSchema,
    { content: "" },
    async (values) => {
      await api(`/medical-records/${recordId}/addenda`, { method: "POST", body: values });
      onAdded();
    },
  );

  return (
    <Dialog title="Dodaj dodatek" onClose={onClose}>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
        {formError && <Note tone="bad">{formError}</Note>}
        <TextareaField label="Vsebina dodatka" rows={4} {...field("content")} />
        <div className="flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>
            Prekliči
          </Btn>
          <Btn type="submit" disabled={submitting}>
            Dodaj dodatek
          </Btn>
        </div>
      </form>
    </Dialog>
  );
}
