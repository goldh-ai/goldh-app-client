/**
 * shared/schema.ts — Client-side shim
 *
 * This file is a shim for the client-side repository (goldh-app-client).
 * It re-exports EVERYTHING from contracts.ts to satisfy imports from "@shared/schema"
 * without requiring Drizzle ORM or database-specific code.
 */

export * from "./contracts";
