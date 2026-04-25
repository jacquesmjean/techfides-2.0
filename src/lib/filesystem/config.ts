import path from "node:path";
import os from "node:os";

/**
 * Resolves the TechFides operations folder root.
 *
 * Default: ~/Desktop/TechFides
 * Override with the TECHFIDES_OPS_ROOT environment variable.
 *
 * The ops root must already exist on disk — this module never creates it.
 * That's intentional: we don't want a typo or misconfigured env var to
 * silently produce a "TechFides" folder in an unexpected location.
 */
export function getOpsRoot(): string {
  const env = process.env.TECHFIDES_OPS_ROOT;
  if (env && env.length > 0) return path.resolve(env);
  return path.join(os.homedir(), "Desktop", "TechFides");
}

/**
 * Get the path to a top-level ops folder (e.g. "Clients", "HR").
 */
export function getOpsSubpath(...segments: string[]): string {
  return path.join(getOpsRoot(), ...segments);
}
