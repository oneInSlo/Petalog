import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Btn } from "../../components/ui/Btn";
import { Dialog } from "../../components/ui/Dialog";
import { Field } from "../../components/ui/Field";
import { Note } from "../../components/ui/Note";
import { SelectField } from "../../components/ui/SelectField";
import { formatMonths, type Animal } from "../../lib/animals";
import { api } from "../../lib/api";
import { todayAtClinic } from "../../lib/dates";
import { useForm } from "../../lib/useForm";
import type { CalendarEntry, Vaccine } from "../../lib/vaccinations";

// The date rules live in the backend and come back as field errors
const vaccinationSchema = z.object({
  vaccineId: z.string().min(1, "Cepivo je obvezno"),
  vaccinationDate: z.string(),
  batchNumber: z.string(),
});

export function AddVaccinationDialog({
  animal,
  onClose,
  onAdded,
}: {
  animal: Animal;
  onClose: () => void;
  onAdded: (vaccination: CalendarEntry) => void;
}) {
  const [vaccines, setVaccines] = useState<Vaccine[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const today = todayAtClinic();

  const { field, formError, submitting, handleSubmit } = useForm(
    vaccinationSchema,
    { vaccineId: "", vaccinationDate: today, batchNumber: "" },
    async ({ vaccineId, ...values }) => {
      const { vaccination } = await api<{ vaccination: CalendarEntry }>(
        `/animals/${animal.id}/vaccinations`,
        { method: "POST", body: { ...values, vaccineId: Number(vaccineId) } },
      );
      onAdded(vaccination);
    },
  );

  useEffect(() => {
    let cancelled = false;

    api<{ vaccines: Vaccine[] }>(`/animals/${animal.id}/vaccines`)
      .then((data) => {
        if (!cancelled) setVaccines(data.vaccines);
      })
      .catch((caught: Error) => {
        if (!cancelled) setLoadError(caught.message);
      });

    return () => {
      cancelled = true;
    };
  }, [animal.id]);

  const vaccineField = field("vaccineId");
  const selected = vaccines?.find(({ id }) => String(id) === vaccineField.value);
  const options = [
    { value: "", label: vaccines ? "Izberite ..." : "Nalaganje ..." },
    ...(vaccines ?? []).map(({ id, name }) => ({ value: String(id), label: name })),
  ];

  return (
    <Dialog title="Dodaj cepljenje" onClose={onClose}>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
        {formError && <Note tone="bad">{formError}</Note>}
        {loadError && <Note tone="bad">{loadError}</Note>}
        {vaccines?.length === 0 && (
          <Note tone="warn">Za to vrsto živali ni aktivnih cepiv.</Note>
        )}
        <SelectField
          label="Cepivo"
          options={options}
          disabled={!vaccines || vaccines.length === 0}
          {...vaccineField}
        />
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-4">
          <Field
            className="flex-1"
            label="Datum"
            type="date"
            max={today}
            hint="Privzeto danes"
            {...field("vaccinationDate")}
          />
          <Field
            className="flex-1"
            label="Serijska številka (neobvezno)"
            autoComplete="off"
            {...field("batchNumber")}
          />
        </div>
        {selected && (
          <Note tone="primary" icon={Clock}>
            Naslednji rok bo izračunan ob shranjevanju (interval:{" "}
            {formatMonths(selected.intervalMonths)})
          </Note>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>
            Prekliči
          </Btn>
          <Btn type="submit" disabled={submitting || !vaccines || vaccines.length === 0}>
            Dodaj cepljenje
          </Btn>
        </div>
      </form>
    </Dialog>
  );
}
