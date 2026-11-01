import { fullName, type Addendum } from "../../lib/medicalRecords";
import { formatDateTime } from "../../lib/dates";

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

export function ReadOnlyRecord({
  anamnesis,
  diagnosis,
  therapy,
}: {
  anamnesis: string;
  diagnosis: string;
  therapy: string | null;
}) {
  return (
    <div className="flex flex-col gap-5">
      <ReadOnlyText label="Anamneza" text={anamnesis} />
      <ReadOnlyText label="Diagnoza" text={diagnosis} />
      <ReadOnlyText label="Terapija" text={therapy} />
    </div>
  );
}

export function AddendaList({ addenda }: { addenda: Addendum[] }) {
  return addenda.map((addendum) => (
    <div key={addendum.id} className="flex flex-col gap-1 rounded-md border border-border p-4">
      <span className="text-[13px] font-semibold text-muted-foreground">
        Dodatek · {fullName(addendum.author)} · {formatDateTime(addendum.createdAt)}
      </span>
      <span className="whitespace-pre-wrap break-words text-[14px]">{addendum.content}</span>
    </div>
  ));
}
