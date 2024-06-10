//import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
import { defineConfig } from "drizzle-kit"

export default defineConfig({
    dialect: "postgresql", // "postgresql" | "mysql"
     // optional and used only if `aws-data-api`, `turso`, `d1-http`(WIP) or `expo` are used
    schema: "./src/lib/db/schema.ts",
    dbCredentials: {
        url: "postgresql://neondb_owner:6SMnghNHi9LB@ep-shy-pond-a1q41z7d.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
    }
})


// npx drizzle-kit push:pg