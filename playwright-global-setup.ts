import * as fs from "node:fs";
import * as path from "node:path";

export default async function globalSetup() {
  const db = path.join(process.cwd(), "data", "meetups.sqlite");
  if (fs.existsSync(db)) {
    try {
      fs.unlinkSync(db);
    } catch {
      /* another process may hold the file; tests still run */
    }
  }
}
