import { useState } from "react";
import { Btn } from "../../components/ui/Btn";
import { Dialog } from "../../components/ui/Dialog";
import { Note } from "../../components/ui/Note";
import { api } from "../../lib/api";
import type { StaffMember } from "./staff";

export function DeactivateStaffDialog({
  user,
  onClose,
  onDeactivated,
}: {
  user: StaffMember;
  onClose: () => void;
  onDeactivated: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    setError(null);
    setSubmitting(true);
    try {
      await api(`/users/${user.id}/deactivate`, { method: "POST" });
      onDeactivated();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : null);
      setSubmitting(false);
    }
  }

  return (
    <Dialog title="Deaktiviraj uporabnika" onClose={onClose}>
      {error && <Note tone="bad">{error}</Note>}
      <p>
        Uporabnik{" "}
        <b>
          {user.firstName} {user.lastName}
        </b>{" "}
        se ne bo več mogel prijaviti. Njegovi pretekli zapisi ostanejo v evidenci.
      </p>
      <div className="flex justify-end gap-3 pt-2">
        <Btn variant="secondary" onClick={onClose}>
          Prekliči
        </Btn>
        <Btn variant="danger" disabled={submitting} onClick={handleConfirm}>
          Deaktiviraj
        </Btn>
      </div>
    </Dialog>
  );
}
