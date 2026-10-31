import { useAuth } from "../auth/AuthContext";
import { AppFrame } from "../components/ui/AppFrame";
import { Card } from "../components/ui/Card";

export function HomePage() {
  const { user } = useAuth();

  return (
    <AppFrame title="Nadzorna plošča" subtitle={`Pozdravljeni, ${user?.firstName}`}>
      <Card>
        <p className="text-muted-foreground">Vsebina te strani je v pripravi.</p>
      </Card>
    </AppFrame>
  );
}
