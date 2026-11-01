import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AppFrame } from "../../components/ui/AppFrame";
import { Card } from "../../components/ui/Card";
import { Note } from "../../components/ui/Note";
import type { Allergy } from "../../lib/allergies";
import type { Animal } from "../../lib/animals";
import { api } from "../../lib/api";
import type { MedicalRecord } from "../../lib/medicalRecords";
import { RecordForm, type RecordValues } from "./RecordForm";
import { RecordLayout } from "./RecordLayout";

export function NewMedicalRecordPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<{ animal: Animal; allergies: Allergy[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      api<{ animal: Animal }>(`/animals/${id}`),
      api<{ allergies: Allergy[] }>(`/animals/${id}/allergies`),
    ])
      .then(([{ animal }, { allergies }]) => {
        if (!cancelled) setPatient({ animal, allergies });
      })
      .catch((caught: Error) => {
        if (!cancelled) setError(caught.message);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSave(values: RecordValues) {
    const { record } = await api<{ record: MedicalRecord }>(`/animals/${id}/medical-records`, {
      method: "POST",
      body: values,
    });
    navigate(`/medical-records/${record.id}`, { replace: true, state: { saved: true } });
  }

  return (
    <AppFrame title="Nov zdravstveni zapis" subtitle={patient?.animal.name}>
      {error && <Note tone="bad">{error}</Note>}
      {!patient && !error && <p className="text-muted-foreground">Nalaganje ...</p>}
      {patient && (
        <RecordLayout animal={patient.animal} allergies={patient.allergies}>
          <Card className="gap-6">
            <h2 className="font-display text-[24px] font-bold">Zdravstveni zapis</h2>
            <RecordForm record={null} allergies={patient.allergies} onSave={handleSave} />
          </Card>
        </RecordLayout>
      )}
    </AppFrame>
  );
}
