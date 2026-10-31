import { useAuth } from "../../auth/AuthContext";
import { registerSchema } from "../../auth/schemas";
import { Btn } from "../../components/ui/Btn";
import { Field } from "../../components/ui/Field";
import { Note } from "../../components/ui/Note";
import { useForm } from "../../lib/useForm";
import { AuthShell } from "./AuthShell";

export function RegisterPage() {
  const { register } = useAuth();
  const { field, formError, submitting, handleSubmit } = useForm(
    registerSchema,
    { firstName: "", lastName: "", email: "", password: "" },
    register,
  );

  return (
    <AuthShell tab={1}>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
        {formError && <Note tone="bad">{formError}</Note>}
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
          <Field
            className="flex-1"
            label="Ime"
            autoComplete="given-name"
            {...field("firstName")}
          />
          <Field
            className="flex-1"
            label="Priimek"
            autoComplete="family-name"
            {...field("lastName")}
          />
        </div>
        <Field label="E-pošta" type="email" autoComplete="email" {...field("email")} />
        <Field
          label="Geslo"
          type="password"
          autoComplete="new-password"
          placeholder="Vnesite geslo"
          hint="Najmanj 8 znakov"
          {...field("password")}
        />
        <Btn type="submit" className="w-full" disabled={submitting}>
          Ustvari račun
        </Btn>
      </form>
    </AuthShell>
  );
}
