// validators/uploadValidator.ts
//
// 1. Verify file is provided
// 2. Verify file extension matches expectedExtension (default .csv)
// 3. Verify file size does not exceed maxSizeMB
// 4. Read file text using FileReader
// 5. Verify file text is not empty
// 6. Split text into lines and verify at least one line exists
// 7. Parse first line as headers (no validation)
// 8. Parse remaining lines as CSV rows (no validation)

import { readFileAsText, splitLines, parseHeaders, parseRow } from "./utils";

const EXPECTED_EXTENSIONS: string[] = [".csv"];
const MAX_UPLOAD_SIZE_MB = 10;

async function validateUploadedFile(file: File | null): Promise<{
  errors: string[];
  parsed?: {
    headers: string[];
    rows: string[][];
    rawText: string;
  };
}> {
  let errors: string[] = [];

  if (!file) {
    errors.push("File is required");
    return { errors };
  }

  const extension = EXPECTED_EXTENSIONS.find((ext) => file.name.toLowerCase().endsWith(ext));
  if (!extension) {
    errors.push(`Only ${EXPECTED_EXTENSIONS.join(", ")} files are allowed`);
    return { errors };
  }

  const maxBytes = MAX_UPLOAD_SIZE_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    errors.push(`File size exceeds ${MAX_UPLOAD_SIZE_MB}MB`);
    return { errors };
  }

  const text = await readFileAsText(file);

  if (!text.trim()) {
    errors.push("CSV file is empty");
    return { errors };
  }

  const lines = splitLines(text);
  if (lines.length === 0) {
    errors.push("CSV has no rows");
    return { errors };
  }

  const headers = parseHeaders(lines[0]);
  const rows = lines.slice(1).map((line) => parseRow(line));

  return {
    errors,
    parsed: { headers, rows, rawText: text },
  };
}

export { validateUploadedFile };
