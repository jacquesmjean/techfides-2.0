import fs from "node:fs/promises";
import path from "node:path";

import { getOpsRoot } from "./config";
import { safeFolderName, assertWithin } from "./safety";
import {
  CLIENT_SUBFOLDERS,
  EMPLOYEE_SUBFOLDERS,
  renderClientReadme,
  renderEmployeeReadme,
  type ClientReadmeMeta,
  type EmployeeReadmeMeta,
} from "./templates";

export interface ScaffoldResult {
  /** Absolute path to the scaffolded folder */
  rootPath: string;
  /** Subfolders that did not exist before this call */
  createdSubfolders: string[];
  /** True if the folder already existed (subfolders may still have been added) */
  alreadyExisted: boolean;
  /** Absolute path to the generated _README.md */
  readmePath: string;
}

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function scaffold(
  parentName: "Clients" | "HR",
  safeName: string,
  subfolders: readonly string[],
  readmeContent: string
): Promise<ScaffoldResult> {
  const opsRoot = getOpsRoot();
  const parentRoot = path.join(opsRoot, parentName);
  const personPath = path.join(parentRoot, safeName);
  assertWithin(parentRoot, personPath);

  // Refuse to silently create the ops root or the parent (Clients / HR).
  // Both should already exist as part of the standard folder scaffold.
  if (!(await exists(opsRoot))) {
    throw new Error(
      `Ops root does not exist: ${opsRoot}. Set TECHFIDES_OPS_ROOT or create the folder.`
    );
  }
  if (!(await exists(parentRoot))) {
    throw new Error(
      `Parent folder does not exist: ${parentRoot}. Run the canonical folder setup first.`
    );
  }

  const alreadyExisted = await exists(personPath);
  if (!alreadyExisted) {
    await fs.mkdir(personPath, { recursive: true });
  }

  const createdSubfolders: string[] = [];
  for (const sub of subfolders) {
    const subPath = path.join(personPath, sub);
    if (!(await exists(subPath))) {
      await fs.mkdir(subPath, { recursive: true });
      createdSubfolders.push(sub);
    }
  }

  const readmePath = path.join(personPath, "_README.md");
  await fs.writeFile(readmePath, readmeContent, "utf8");

  return { rootPath: personPath, createdSubfolders, alreadyExisted, readmePath };
}

/**
 * Idempotently scaffold a client folder under <opsRoot>/Clients/<safeName>/.
 *
 * - Creates the client folder if it doesn't exist
 * - Ensures all standard subfolders exist (01-Discovery .. 05-Support)
 * - Writes/overwrites _README.md with current metadata
 *
 * Safe to call repeatedly. Typical triggers:
 *   - ClientAccount.create
 *   - ClientAccount.update (when companyName changes — note: this creates
 *     a NEW folder; you'll need to migrate the old one separately)
 *   - DealRoom.status -> SIGNED (auto-promote Lead to ClientAccount)
 */
export async function scaffoldClientFolder(
  meta: ClientReadmeMeta
): Promise<ScaffoldResult> {
  const safeName = safeFolderName(meta.companyName);
  return scaffold("Clients", safeName, CLIENT_SUBFOLDERS, renderClientReadme(meta));
}

/**
 * Idempotently scaffold an employee folder under <opsRoot>/HR/<safeName>/.
 *
 * Phase 1 ready (this function works today). Phase 2 wires it up to a real
 * Employee Prisma model and the /gse/hr UI. Until then, callers must pass
 * EmployeeReadmeMeta explicitly.
 */
export async function scaffoldEmployeeFolder(
  meta: EmployeeReadmeMeta
): Promise<ScaffoldResult> {
  const safeName = safeFolderName(meta.name);
  return scaffold("HR", safeName, EMPLOYEE_SUBFOLDERS, renderEmployeeReadme(meta));
}
