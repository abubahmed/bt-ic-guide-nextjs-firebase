// validators/utils.ts
//
// 1. Read file as text
// 2. Split text into lines
// 3. Parse headers from first line
// 4. Parse rows from remaining lines
// 5. Check required headers
// 6. Check column count
// 7. Make object from row
// 8. Normalize string
// 9. Validate email
// 10. Validate phone

import fs from "fs";

export function readFileAsText(file: File): Promise<string> {
  if (typeof FileReader === "undefined") {
    const filePath = (file as any).path || file.name;
    return Promise.resolve(fs.readFileSync(filePath, "utf8"));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function splitLines(text: string): string[] {
  return text.trim().replace(/\r/g, "").split("\n");
}

export function parseHeaders(line: string): string[] {
  return line.split(",").map((h) => h.trim());
}

export function parseRow(line: string): string[] {
  return line.split(",").map((v) => v.trim());
}

export function checkRequiredHeaders(actual: string[], expected: string[]): string[] {
  const errors: string[] = [];
  for (const h of expected) {
    if (!actual.includes(h)) errors.push(`Missing required column: ${h}`);
  }
  return errors;
}

export function checkColumnCount(row: string[], expectedCount: number): string | null {
  if (row.length !== expectedCount) {
    return `Invalid number of columns. Expected ${expectedCount}, got ${row.length}`;
  }
  return null;
}

export function normalizeString(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  return value.includes("@");
}

export function isValidPhone(value: string): boolean {
  return /^\d+$/.test(value);
}
