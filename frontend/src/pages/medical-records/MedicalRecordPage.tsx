import { Lock, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import { AppFrame } from "../../components/ui/AppFrame";
import { Btn } from "../../components/ui/Btn";
import { Card } from "../../components/ui/Card";
import { Note } from "../../components/ui/Note";
import type { Allergy } from "../../lib/allergies";
import type { Animal } from "../../lib/animals";
import { api } from "../../lib/api";
import { formatDateTime, formatTimestampDate } from "../../lib/dates";
import { fullName, type MedicalRecord } from "../../lib/medicalRecords";
import { AddAddendumDialog } from "./AddAddendumDialog";
import { CloseRecordDialog } from "./CloseRecordDialog";
import { AddendaList, ReadOnlyRecord } from "./ReadOnlyRecord";
import { RecordForm, type RecordValues } from "./RecordForm";
import { RecordLayout } from "./RecordLayout";
import { RecordStatusBadge } from "./RecordStatusBadge";

type RecordData = { record: MedicalRecord; animal: Animal; allergies: Allergy[] };

export function MedicalRecordPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const [data, setData] = useState<RecordData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);
  const [saveCount, setSaveCount] = useState(0);
  const [justSaved, setJustSaved] = useState(false);
  const [closing, setClosing] = useState(false);
  const [addingAddendum, setAddingAddendum] = useState(false);

  useEffect(() => {
    setJustSaved(Boolean(location.state?.saved));
  }, [id, location.state]);

  useEffect(() => {
    let cancelled = false;
    setError(null);

    api<{ record: MedicalRecord }>(`/medical-records/${id}`)
      .then(async ({ record }) => {
        const [{ animal }, { allergies }] = await Promise.all([
          api<{ animal: Animal }>(`/animals/${record.animalId}`),
          api<{ allergies: Allergy[] }>(`/animals/${record.animalId}/allergies`),
        ]);
        if (!cancelled) setData({ record, animal, allergies });
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
    setData((current) => current && { ...current, record: saved.record });
    setJustSaved(true);
    // Remounts the form so that it compares later changes with the saved values
    setSaveCount((count) => count + 1);
  }

  const record = data?.record;
  const isClosed = record?.status === "CLOSED";
  const isAuthor = record?.veterinarianId === user?.id;

  return (
    <AppFrame title="Zdravstveni zapis" subtitle={data?.animal.name}>
      {error && <Note tone="bad">{error}</Note>}
      {!data && !error && <p className="text-muted-foreground">Nalaganje ...</p>}

      {data && record && (
        <RecordLayout
          animal={data.animal}
          allergies={data.allergies}
          historyKey={`${reloadCount}-${saveCount}`}
        >
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
                key={`${record.id}-${saveCount}`}
                record={record}
                allergies={data.allergies}
                justSaved={justSaved}
                onSave={handleSave}
                onRequestClose={() => setClosing(true)}
              />
            ) : (
              <ReadOnlyRecord
                anamnesis={record.anamnesis}
                diagnosis={record.diagnosis}
                therapy={record.therapy}
              />
            )}

            {isClosed && (
              <div className="flex flex-col gap-3 border-t border-border pt-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold">Dodatki</span>
                  <Btn
                    size="sm"
                    variant="secondary"
                    icon={Plus}
                    onClick={() => setAddingAddendum(true)}
                  >
                    Dodaj dodatek
                  </Btn>
                </div>
                {record.addenda.length === 0 && (
                  <p className="text-[14px] text-muted-foreground">Ni dodatkov.</p>
                )}
                <AddendaList addenda={record.addenda} />
              </div>
            )}
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
        </RecordLayout>
      )}
    </AppFrame>
  );
}
