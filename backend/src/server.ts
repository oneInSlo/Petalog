import { app } from "./app.js";
import { parseEnv } from "./config/env.js";

const env = parseEnv(process.env);

app.listen(env.PORT, () => {
  console.log(`Backend listening on port ${env.PORT}`);
});
