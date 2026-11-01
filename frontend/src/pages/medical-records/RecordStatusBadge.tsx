import { Lock } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import type { MedicalRecord } from "../../lib/medicalRecords";

export function RecordStatusBadge({ status }: { status: MedicalRecord["status"] }) {
  if (status === "DRAFT") return <Badge tone="warn">Osnutek</Badge>;

  return (
    <Badge tone="ok">
      <Lock size={13} />
      Zaključeno
    </Badge>
  );
}
