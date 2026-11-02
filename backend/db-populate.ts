import "temporal-polyfill/global";
import { db } from "./src/prisma/db.ts";
import populate  from "./src/seed.ts";

populate()
  .then(() => db.close())
  .catch(async (error) => {
    console.error(error);
    await db.close();
    process.exit(1);
  });

export { populate };
