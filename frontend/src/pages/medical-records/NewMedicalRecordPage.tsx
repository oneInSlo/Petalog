import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AppFrame } from "../../components/ui/AppFrame";
import { Card } from "../../components/ui/Card";
import { Note } from "../../components/ui/Note";
import type { Animal } from "../../lib/animals";
import { api } from "../../lib/api";
import type { MedicalRecord } from "../../lib/medicalRecords";
import { AnimalHeader } from "../animals/AnimalHeader";
import { RecordForm, type RecordValues } from "./RecordForm";

export function NewMedicalRecordPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    api<{ animal: Animal }>(`/animals/${id}`)
      .then((data) => {
        if (!cancelled) setAnimal(data.animal);
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
    <AppFrame title="Nov zdravstveni zapis" subtitle={animal?.name}>
      {error && <Note tone="bad">{error}</Note>}
      {!animal && !error && <p className="text-muted-foreground">Nalaganje ...</p>}
      {animal && (
        <>
          <AnimalHeader animal={animal} />
          <Card className="gap-6">
            <h2 className="font-display text-[24px] font-bold">Zdravstveni zapis</h2>
            <RecordForm record={null} onSave={handleSave} />
          </Card>
        </>
      )}
    </AppFrame>
  );
}
