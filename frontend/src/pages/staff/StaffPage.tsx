import { Filter, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { roleLabels } from "../../auth/roles";
import { AppFrame } from "../../components/ui/AppFrame";
import { Badge } from "../../components/ui/Badge";
import { Btn } from "../../components/ui/Btn";
import { Card } from "../../components/ui/Card";
import { Note } from "../../components/ui/Note";
import { PersonAvatar } from "../../components/ui/PersonAvatar";
import { Table } from "../../components/ui/Table";
import { api } from "../../lib/api";
import { AddStaffDialog } from "./AddStaffDialog";
import { DeactivateStaffDialog } from "./DeactivateStaffDialog";
import { roleOptions, roleTones, type StaffMember, type StaffRole } from "./staff";

function fullName(user: StaffMember) {
  return `${user.firstName} ${user.lastName}`;
}

function RoleBadge({ user }: { user: StaffMember }) {
  return <Badge tone={roleTones[user.role as StaffRole]}>{roleLabels[user.role]}</Badge>;
}

function StatusBadge({ user }: { user: StaffMember }) {
  return (
    <Badge tone={user.isActive ? "ok" : "neutral"}>{user.isActive ? "Aktiven" : "Deaktiviran"}</Badge>
  );
}

export function StaffPage() {
  const { user: currentUser } = useAuth();
  const [role, setRole] = useState<StaffRole | "">("");
  const [users, setUsers] = useState<StaffMember[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);
  const [adding, setAdding] = useState(false);
  const [deactivating, setDeactivating] = useState<StaffMember | null>(null);
  const [activatingId, setActivatingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);

    api<{ users: StaffMember[] }>(`/users${role ? `?role=${role}` : ""}`)
      .then((data) => {
        if (!cancelled) setUsers(data.users);
      })
      .catch((caught: Error) => {
        if (!cancelled) setError(caught.message);
      });

    return () => {
      cancelled = true;
    };
  }, [role, reloadCount]);

  function reload() {
    setAdding(false);
    setDeactivating(null);
    setReloadCount((count) => count + 1);
  }

  async function handleActivate(user: StaffMember) {
    setError(null);
    setActivatingId(user.id);
    try {
      await api(`/users/${user.id}/activate`, { method: "POST" });
      reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : null);
    } finally {
      setActivatingId(null);
    }
  }

  function action(user: StaffMember) {
    if (!user.isActive) {
      return (
        <Btn
          variant="ghost"
          size="sm"
          disabled={activatingId === user.id}
          onClick={() => handleActivate(user)}
        >
          Aktiviraj
        </Btn>
      );
    }

    const isSelf = user.id === currentUser?.id;

    return (
      <Btn
        variant="ghost"
        size="sm"
        disabled={isSelf}
        title={isSelf ? "Svojega računa ne morete deaktivirati" : undefined}
        onClick={() => setDeactivating(user)}
      >
        Deaktiviraj
      </Btn>
    );
  }

  return (
    <AppFrame title="Osebje">
      {error && <Note tone="bad">{error}</Note>}
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex h-10 items-center gap-2 rounded-md border border-border bg-card px-3 text-[14px]">
            <Filter size={16} className="shrink-0 text-muted-foreground" />
            Vloga:
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as StaffRole | "")}
              className="min-w-0 flex-1 cursor-pointer bg-transparent font-bold outline-none"
            >
              <option value="">Vse</option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <Btn icon={Plus} onClick={() => setAdding(true)}>
            Dodaj uporabnika
          </Btn>
        </div>

        {users === null && !error && <p className="text-muted-foreground">Nalaganje ...</p>}
        {users?.length === 0 && <p className="text-muted-foreground">Ni osebja s to vlogo.</p>}
        {users && users.length > 0 && (
          <>
            <Table
              className="hidden md:block"
              head={["Ime", "E-pošta", "Vloga", "Status", ""]}
              rows={users.map((user) => [
                <div className="flex items-center gap-3">
                  <PersonAvatar name={fullName(user)} />
                  <span className="min-w-0 font-semibold">{fullName(user)}</span>
                </div>,
                user.email,
                <RoleBadge user={user} />,
                <StatusBadge user={user} />,
                action(user),
              ])}
            />
            <div className="flex flex-col gap-3 md:hidden">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-3 rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <PersonAvatar name={fullName(user)} />
                    <div className="flex min-w-0 flex-col">
                      <span className="font-semibold">{fullName(user)}</span>
                      <span className="break-words text-[13px] text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <RoleBadge user={user} />
                      <StatusBadge user={user} />
                    </div>
                    {action(user)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {adding && <AddStaffDialog onClose={() => setAdding(false)} onCreated={reload} />}
      {deactivating && (
        <DeactivateStaffDialog
          user={deactivating}
          onClose={() => setDeactivating(null)}
          onDeactivated={reload}
        />
      )}
    </AppFrame>
  );
}
