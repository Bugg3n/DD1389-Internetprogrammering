import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { resolvePath } from "./util.js";

sqlite3.verbose();

// Open and initialize the database
const db = await open({
  filename: resolvePath("db.sqlite"),
  driver: sqlite3.Database,
});

await db.run("DROP TABLE IF EXISTS lorem");
await db.run("CREATE TABLE lorem (username TEXT, password TEXT)"); // 0 = inte inloggad, 1 = inloggad

/* const statement = await db.prepare("INSERT INTO lorem VALUES (?,?)");
for (let i = 0; i < 10; i += 1) {
  statement.run(`ipsum ${i}`,`password`);
} */
// statement.finalize();

export default db;
