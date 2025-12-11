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

import { parseCSV } from "./utils/utils";

const EXPECTED_EXTENSIONS: string[] = [".csv"];
const MAX_UPLOAD_SIZE_MB = 10;

async function validateUploadedFile(
  file: File | null,
  reader: any
): Promise<{
  errors: string[];
  parsed?: {
    headers: string[];
    rows: string[][];
    rawText: string;
  };
}> {
  console.log("reader", reader);
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

  const text = await reader(file as File);
  if (!text.trim()) {
    errors.push("CSV file is empty");
    return { errors };
  }

  const { headers, rows } = parseCSV(text);
  if (rows.length === 0) {
    errors.push("CSV has no rows");
    return { errors };
  }

  return {
    errors,
    parsed: { headers, rows, rawText: text },
  };
}

export { validateUploadedFile };
