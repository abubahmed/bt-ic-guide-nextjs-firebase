import fs from "fs";
import path from "path";

import { validatePersonsFrontend } from "../persons";

export class NodeFile extends File {
  constructor(filePath: string, mime: string = "text/csv") {
    const abs = path.resolve(filePath);
    const buffer = fs.readFileSync(abs);
    super([buffer], path.basename(abs), { type: mime });
    (this as any).path = abs;
  }
}
const SELECTED_FOLDER = "2025-12-10_23-39-11";
const CSV_DIR = path.resolve(__dirname, "../../data-gen/data");

async function runValidator(folder: string) {
  const peopleFile = path.join(CSV_DIR, folder, "persons.csv");

  if (!fs.existsSync(peopleFile)) {
    throw new Error(`persons.csv not found in selected folder: ${folder}`);
  }

  const file = new NodeFile(peopleFile);
  return validatePersonsFrontend(file);
}

describe("testing persons.csv validator", () => {
  it(`${SELECTED_FOLDER}`, async () => {
    const { errors } = await runValidator(SELECTED_FOLDER);

    if (errors.length > 0) {
      console.log("\n===== VALIDATION ERRORS FOUND =====");
      errors.forEach((err) => console.log(" -", err));
      console.log("===================================\n");
    }
    expect(errors.length).toBe(0);
  });
});
