import { useState } from "react";
import { Btn } from "../../components/ui/Btn";
import { Dialog } from "../../components/ui/Dialog";
import { Note } from "../../components/ui/Note";
import type { Animal } from "../../lib/animals";
import { api } from "../../lib/api";

export function DeleteAnimalDialog({
  animal,
  onClose,
  onDeleted,
}: {
  animal: Animal;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    setError(null);
    setSubmitting(true);
    try {
      await api(`/animals/${animal.id}`, { method: "DELETE" });
      onDeleted();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : null);
      setSubmitting(false);
    }
  }

  return (
    <Dialog title="Izbriši žival" onClose={onClose}>
      {error && <Note tone="bad">{error}</Note>}
      <p>
        Ali res želite izbrisati žival <b>{animal.name}</b>? Tega dejanja ni mogoče razveljaviti.
      </p>
      <div className="flex justify-end gap-3 pt-2">
        <Btn variant="secondary" onClick={onClose}>
          Prekliči
        </Btn>
        <Btn variant="danger" disabled={submitting} onClick={handleConfirm}>
          Izbriši
        </Btn>
      </div>
    </Dialog>
  );
}
