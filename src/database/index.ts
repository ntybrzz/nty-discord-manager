import { JsonDatabase } from "wio.db";

const db = new JsonDatabase({ databasePath: "./src/database/data.json" })

export { db }