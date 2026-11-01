import { AlertTriangle, Lock } from "lucide-react";
import { useState } from "react";
import { Btn } from "../../components/ui/Btn";
import { Dialog } from "../../components/ui/Dialog";
import { Note } from "../../components/ui/Note";
import { api } from "../../lib/api";

export function CloseRecordDialog({
  recordId,
  onClose,
  onClosed,
}: {
  recordId: number;
  onClose: () => void;
  onClosed: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    setError(null);
    setSubmitting(true);
    try {
      await api(`/medical-records/${recordId}/close`, { method: "POST" });
      onClosed();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog title="Zaključi zapis" onClose={onClose}>
      <div className="flex flex-col gap-5">
        {error && <Note tone="bad">{error}</Note>}
        <p className="text-muted-foreground">
          Po zaključku bo zapis zaklenjen in ga ne bo več mogoče urejati. Kasneje ga lahko le
          dopolnite z dodatki, ki bodo vidni s podatkom o avtorju in času.
        </p>
        <Note tone="warn" icon={AlertTriangle}>
          Preverite terapijo in odmerke, preden nadaljujete.
        </Note>
        <div className="flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>
            Prekliči
          </Btn>
          <Btn icon={Lock} disabled={submitting} onClick={handleConfirm}>
            Zaključi zapis
          </Btn>
        </div>
      </div>
    </Dialog>
  );
}
