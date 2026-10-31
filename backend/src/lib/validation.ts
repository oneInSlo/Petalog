import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce.number({ error: "Neveljaven ID" }).int("Neveljaven ID").positive("Neveljaven ID"),
});
