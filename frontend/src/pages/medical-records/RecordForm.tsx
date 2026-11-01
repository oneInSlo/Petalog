import { CheckCircle2, Save } from "lucide-react";
import { z } from "zod";
import { Btn } from "../../components/ui/Btn";
import { Note } from "../../components/ui/Note";
import { TextareaField } from "../../components/ui/TextareaField";
import type { MedicalRecord } from "../../lib/medicalRecords";
import { useForm } from "../../lib/useForm";

const recordSchema = z.object({
  anamnesis: z.string().trim().min(1, "Anamneza je obvezna"),
  diagnosis: z.string().trim().min(1, "Diagnoza je obvezna"),
  therapy: z.string(),
});

export type RecordValues = z.infer<typeof recordSchema>;

export function RecordForm({
  record,
  justSaved = false,
  onSave,
  onRequestClose,
}: {
  record: MedicalRecord | null;
  justSaved?: boolean;
  onSave: (values: RecordValues) => Promise<void>;
  onRequestClose?: () => void;
}) {
  const initialValues = {
    anamnesis: record?.anamnesis ?? "",
    diagnosis: record?.diagnosis ?? "",
    therapy: record?.therapy ?? "",
  };
  const { field, formError, submitting, handleSubmit } = useForm(
    recordSchema,
    initialValues,
    onSave,
  );

  const isDirty =
    field("anamnesis").value !== initialValues.anamnesis ||
    field("diagnosis").value !== initialValues.diagnosis ||
    field("therapy").value !== initialValues.therapy;

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      {formError && <Note tone="bad">{formError}</Note>}
      {justSaved && !isDirty && <Note tone="ok">Osnutek je shranjen.</Note>}
      <TextareaField label="Anamneza" rows={3} {...field("anamnesis")} />
      <TextareaField label="Diagnoza" rows={2} {...field("diagnosis")} />
      <TextareaField label="Terapija (neobvezno)" rows={5} {...field("therapy")} />
      <div className="flex flex-col items-end gap-2 border-t border-border pt-5">
        <div className="flex flex-wrap justify-end gap-3">
          <Btn type="submit" variant="secondary" icon={Save} disabled={submitting}>
            Shrani osnutek
          </Btn>
          {onRequestClose && (
            <Btn icon={CheckCircle2} disabled={isDirty} onClick={onRequestClose}>
              Zaključi zapis
            </Btn>
          )}
        </div>
        {onRequestClose && isDirty && (
          <span className="text-[13px] text-muted-foreground">
            Pred zaključkom shranite spremembe.
          </span>
        )}
      </div>
    </form>
  );
}
