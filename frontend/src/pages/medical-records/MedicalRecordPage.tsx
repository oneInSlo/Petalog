import { ArrowLeft, Lock, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import { AppFrame } from "../../components/ui/AppFrame";
import { Btn } from "../../components/ui/Btn";
import { Card } from "../../components/ui/Card";
import { Note } from "../../components/ui/Note";
import type { Animal } from "../../lib/animals";
import { api } from "../../lib/api";
import { formatDateTime, formatTimestampDate } from "../../lib/dates";
import { fullName, type MedicalRecord } from "../../lib/medicalRecords";
import { AnimalHeader } from "../animals/AnimalHeader";
import { AddAddendumDialog } from "./AddAddendumDialog";
import { CloseRecordDialog } from "./CloseRecordDialog";
import { RecordForm, type RecordValues } from "./RecordForm";
import { RecordStatusBadge } from "./RecordStatusBadge";

function ReadOnlyText({ label, text }: { label: string; text: string | null }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-foreground">{label}</span>
      <p className="whitespace-pre-wrap break-words text-[14px]">
        {text ?? <span className="text-muted-foreground">Ni vpisana</span>}
      </p>
    </div>
  );
}

function ReadOnlyRecord({ record }: { record: MedicalRecord }) {
  return (
    <div className="flex flex-col gap-5">
      <ReadOnlyText label="Anamneza" text={record.anamnesis} />
      <ReadOnlyText label="Diagnoza" text={record.diagnosis} />
      <ReadOnlyText label="Terapija" text={record.therapy} />
    </div>
  );
}

function Addenda({ record, onAdd }: { record: MedicalRecord; onAdd: () => void }) {
  return (
    <div className="flex flex-col gap-3 border-t border-border pt-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-bold">Dodatki</span>
        <Btn size="sm" variant="secondary" icon={Plus} onClick={onAdd}>
          Dodaj dodatek
        </Btn>
      </div>
      {record.addenda.length === 0 && (
        <p className="text-[14px] text-muted-foreground">Ni dodatkov.</p>
      )}
      {record.addenda.map((addendum) => (
        <div key={addendum.id} className="flex flex-col gap-1 rounded-md border border-border p-4">
          <span className="text-[13px] font-semibold text-muted-foreground">
            Dodatek · {fullName(addendum.author)} · {formatDateTime(addendum.createdAt)}
          </span>
          <span className="whitespace-pre-wrap break-words text-[14px]">{addendum.content}</span>
        </div>
      ))}
    </div>
  );
}

export function MedicalRecordPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);
  const [saveCount, setSaveCount] = useState(0);
  const [justSaved, setJustSaved] = useState(Boolean(location.state?.saved));
  const [closing, setClosing] = useState(false);
  const [addingAddendum, setAddingAddendum] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setError(null);

    api<{ record: MedicalRecord }>(`/medical-records/${id}`)
      .then(async (recordData) => {
        const animalData = await api<{ animal: Animal }>(`/animals/${recordData.record.animalId}`);
        if (cancelled) return;
        setRecord(recordData.record);
        setAnimal(animalData.animal);
      })
      .catch((caught: Error) => {
        if (!cancelled) setError(caught.message);
      });

    return () => {
      cancelled = true;
    };
  }, [id, reloadCount]);

  function reload() {
    setClosing(false);
    setAddingAddendum(false);
    setJustSaved(false);
    setReloadCount((count) => count + 1);
  }

  async function handleSave(values: RecordValues) {
    const saved = await api<{ record: MedicalRecord }>(`/medical-records/${id}`, {
      method: "PUT",
      body: values,
    });
    setRecord(saved.record);
    setJustSaved(true);
    // Remounts the form so that it compares later changes with the saved values
    setSaveCount((count) => count + 1);
  }

  const isClosed = record?.status === "CLOSED";
  const isAuthor = record?.veterinarianId === user?.id;

  return (
    <AppFrame title="Zdravstveni zapis" subtitle={animal?.name}>
      {error && <Note tone="bad">{error}</Note>}
      {!record && !error && <p className="text-muted-foreground">Nalaganje ...</p>}

      {record && animal && (
        <>
          <Link
            to={`/animals/${animal.id}`}
            className="flex items-center gap-2 self-start text-[14px] font-semibold text-primary"
          >
            <ArrowLeft size={16} />
            Nazaj na karton
          </Link>
          <AnimalHeader animal={animal} />
          <Card className="gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 flex-col">
                <h2 className="font-display text-[24px] font-bold">Zdravstveni zapis</h2>
                <span className="text-[13px] text-muted-foreground">
                  {formatTimestampDate(record.createdAt)} · {fullName(record.veterinarian)}
                </span>
              </div>
              <RecordStatusBadge status={record.status} />
            </div>

            {isClosed && record.closedAt && (
              <Note tone="neutral" icon={Lock}>
                Zaključeno {formatDateTime(record.closedAt)} · Zapis je zaklenjen in ga je mogoče le
                dopolniti z dodatki.
              </Note>
            )}
            {!isClosed && !isAuthor && (
              <Note tone="neutral">
                Osnutek lahko ureja in zaključi samo veterinar, ki ga je ustvaril.
              </Note>
            )}

            {!isClosed && isAuthor ? (
              <RecordForm
                key={saveCount}
                record={record}
                justSaved={justSaved}
                onSave={handleSave}
                onRequestClose={() => setClosing(true)}
              />
            ) : (
              <ReadOnlyRecord record={record} />
            )}

            {isClosed && <Addenda record={record} onAdd={() => setAddingAddendum(true)} />}
          </Card>

          {closing && (
            <CloseRecordDialog
              recordId={record.id}
              onClose={() => setClosing(false)}
              onClosed={reload}
            />
          )}
          {addingAddendum && (
            <AddAddendumDialog
              recordId={record.id}
              onClose={() => setAddingAddendum(false)}
              onAdded={reload}
            />
          )}
        </>
      )}
    </AppFrame>
  );
}
