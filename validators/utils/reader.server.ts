// validators/utils/reader.server.ts

import fs from "fs";

export function readFileAsText(file: File): string {
  const filePath = (file as any).path;
  if (!filePath) {
    throw new Error("Backend file reading requires file.path to exist. Use NodeFile shim in tests or include .path.");
  }

  return fs.readFileSync(filePath, "utf8");
}
