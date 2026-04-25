import path from "node:path";

/**
 * Convert a free-form name (company name, person name) into a safe folder
 * segment that won't break the filesystem or escape its parent directory.
 *
 * - Trims whitespace
 * - Replaces path separators (/, \, :) with hyphens
 * - Strips ".." traversal sequences
 * - Removes control characters
 * - Collapses repeated whitespace
 * - Caps length at 80 chars (Finder shows the full name, but long names
 *   break some legacy tools)
 */
export function safeFolderName(name: string): string {
  const noPathSep = name.replace(/[\/\\:]/g, "-");
  const noTraversal = noPathSep.replace(/\.\./g, "-");
  // eslint-disable-next-line no-control-regex
  const noControl = noTraversal.replace(/[\x00-\x1f]/g, "");
  const single = noControl.replace(/\s+/g, " ").trim();
  if (single.length === 0) {
    throw new Error("Folder name cannot be empty after sanitization");
  }
  return single.slice(0, 80);
}

/**
 * Verify that `child` is inside `parent`. Throws if it would escape.
 *
 * Used as a belt-and-suspenders check after safeFolderName, so a bug in
 * sanitization can't accidentally write outside the ops root.
 */
export function assertWithin(parent: string, child: string): void {
  const rel = path.relative(parent, child);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(
      `Path traversal detected: "${child}" is not within "${parent}"`
    );
  }
}
