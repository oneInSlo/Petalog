import { Btn } from "../../components/ui/Btn";
import { Dialog } from "../../components/ui/Dialog";
import { Field } from "../../components/ui/Field";
import { Note } from "../../components/ui/Note";
import { SelectField } from "../../components/ui/SelectField";
import { api } from "../../lib/api";
import { useForm } from "../../lib/useForm";
import { roleOptions, staffSchema } from "./staff";

export function AddStaffDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { field, formError, submitting, handleSubmit } = useForm(
    staffSchema,
    { firstName: "", lastName: "", email: "", password: "", role: "VETERINARIAN" },
    async (values) => {
      await api("/users", { method: "POST", body: values });
      onCreated();
    },
  );

  return (
    <Dialog title="Dodaj uporabnika" onClose={onClose}>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
        {formError && <Note tone="bad">{formError}</Note>}
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-4">
          <Field className="flex-1" label="Ime" autoComplete="off" {...field("firstName")} />
          <Field className="flex-1" label="Priimek" autoComplete="off" {...field("lastName")} />
        </div>
        <Field label="E-pošta" type="email" autoComplete="off" {...field("email")} />
        <Field
          label="Začetno geslo"
          type="password"
          autoComplete="new-password"
          hint="Najmanj 8 znakov"
          {...field("password")}
        />
        <SelectField label="Vloga" options={roleOptions} {...field("role")} />
        <div className="flex justify-end gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose}>
            Prekliči
          </Btn>
          <Btn type="submit" disabled={submitting}>
            Dodaj uporabnika
          </Btn>
        </div>
      </form>
    </Dialog>
  );
}
