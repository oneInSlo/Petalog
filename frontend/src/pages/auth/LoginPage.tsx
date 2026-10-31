import { useAuth } from "../../auth/AuthContext";
import { loginSchema } from "../../auth/schemas";
import { Btn } from "../../components/ui/Btn";
import { Field } from "../../components/ui/Field";
import { Note } from "../../components/ui/Note";
import { useForm } from "../../lib/useForm";
import { AuthShell } from "./AuthShell";

export function LoginPage() {
  const { login } = useAuth();
  const { field, formError, submitting, handleSubmit } = useForm(
    loginSchema,
    { email: "", password: "" },
    login,
  );

  return (
    <AuthShell tab={0}>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
        {formError && <Note tone="bad">{formError}</Note>}
        <Field label="E-pošta" type="email" autoComplete="email" {...field("email")} />
        <Field
          label="Geslo"
          type="password"
          autoComplete="current-password"
          {...field("password")}
        />
        <Btn type="submit" className="w-full" disabled={submitting}>
          Prijava
        </Btn>
      </form>
    </AuthShell>
  );
}
