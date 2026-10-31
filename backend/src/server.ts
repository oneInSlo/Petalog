import { app } from "./app.js";
import { env } from "./config/index.js";

app.listen(env.PORT, () => {
  console.log(`Backend listening on port ${env.PORT}`);
});
