import "temporal-polyfill/global";
import { db } from "./src/prisma/db.ts";
import { populate } from "./src/seed.ts";

populate()
  .then(() => db.close())
  .catch(async (e) => {
    console.error(e);
    await db.close();
    process.exit(1);
  });

export { populate };
