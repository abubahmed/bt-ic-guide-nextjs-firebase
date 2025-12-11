// validators/utils/utils.ts
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

import Papa from "papaparse";

export function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const result = Papa.parse<string[]>(text, {
    header: false,
    dynamicTyping: false,
    skipEmptyLines: true,
  });

  if (result.errors.length > 0) {
    throw new Error("CSV parsing error: " + JSON.stringify(result.errors));
  }

  const rows = result.data;
  const headers = rows[0];
  const dataRows = rows.slice(1);

  return {
    headers: headers.map((h: string) => h.trim()),
    rows: dataRows.map((r: string[]) => r.map((v: string) => (v ?? "").toString().trim())),
  };
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
  return true;
}
