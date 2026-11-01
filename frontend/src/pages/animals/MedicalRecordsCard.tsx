import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Btn } from "../../components/ui/Btn";
import { Card } from "../../components/ui/Card";
import { Note } from "../../components/ui/Note";
import { api } from "../../lib/api";
import { formatTimestampDate } from "../../lib/dates";
import { fullName, type MedicalRecord } from "../../lib/medicalRecords";
import { RecordStatusBadge } from "../medical-records/RecordStatusBadge";

export function MedicalRecordsCard({ animalId }: { animalId: number }) {
  const navigate = useNavigate();
  const [records, setRecords] = useState<MedicalRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    api<{ records: MedicalRecord[] }>(`/animals/${animalId}/medical-records`)
      .then((data) => {
        if (!cancelled) setRecords(data.records);
      })
      .catch((caught: Error) => {
        if (!cancelled) setError(caught.message);
      });

    return () => {
      cancelled = true;
    };
  }, [animalId]);

  return (
    <Card className="gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-[17px] font-bold text-foreground">Zdravstveni zapisi</h3>
        <Btn icon={Plus} onClick={() => navigate(`/animals/${animalId}/medical-records/new`)}>
          Nov zapis
        </Btn>
      </div>
      {error && <Note tone="bad">{error}</Note>}
      {records === null && !error && <p className="text-muted-foreground">Nalaganje ...</p>}
      {records?.length === 0 && (
        <p className="text-muted-foreground">Ni zabeleženih zdravstvenih zapisov.</p>
      )}
      {records && records.length > 0 && (
        <div className="flex flex-col gap-3">
          {records.map((record) => (
            <Link
              key={record.id}
              to={`/medical-records/${record.id}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border p-4 hover:bg-muted"
            >
              <div className="flex min-w-0 flex-col">
                <span className="break-words font-bold">{record.diagnosis}</span>
                <span className="text-[13px] text-muted-foreground">
                  {formatTimestampDate(record.createdAt)} · {fullName(record.veterinarian)}
                </span>
              </div>
              <RecordStatusBadge status={record.status} />
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
