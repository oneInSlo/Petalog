import { useState, type ChangeEvent, type FormEvent } from "react";
import type { z } from "zod";
import { ApiError, type FieldError } from "./api";

type Values = Record<string, string>;

function toFieldErrors(errors: FieldError[]) {
  const result: Record<string, string> = {};
  for (const { field, message } of errors) {
    result[field] ??= message;
  }
  return result;
}

export function useForm<T extends Values>(
  schema: z.ZodType,
  initialValues: T,
  submit: (values: T) => Promise<void>,
) {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(
        toFieldErrors(
          parsed.error.issues.map(({ path, message }) => ({ field: path.join("."), message })),
        ),
      );
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    try {
      await submit(parsed.data as T);
    } catch (error) {
      if (error instanceof ApiError && error.details.length > 0) {
        setFieldErrors(toFieldErrors(error.details));
      } else {
        setFormError(error instanceof Error ? error.message : null);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function field(name: keyof T & string) {
    return {
      name,
      value: values[name],
      error: fieldErrors[name],
      onChange: (event: ChangeEvent<HTMLInputElement>) =>
        setValues((current) => ({ ...current, [name]: event.target.value })),
    };
  }

  return { field, formError, submitting, handleSubmit };
}
