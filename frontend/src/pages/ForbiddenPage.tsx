import { ShieldAlert } from "lucide-react";
import { AppFrame } from "../components/ui/AppFrame";
import { Note } from "../components/ui/Note";

export function ForbiddenPage() {
  return (
    <AppFrame title="Dostop ni dovoljen">
      <Note tone="bad" icon={ShieldAlert}>
        Nimate zadostnih pravic za ogled te strani.
      </Note>
    </AppFrame>
  );
}
