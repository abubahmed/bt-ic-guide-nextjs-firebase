// validators/peopleValidator.ts

import { checkRequiredHeaders, checkColumnCount, isValidEmail, isValidPhone } from "./utils";
import { ROLES, SUBTEAMS, GRADES, Role, Subteam, Grade } from "@/schemas/database";
import { Person, PERSON_HEADERS, PERSON_OBJECT } from "@/schemas/uploads";
import { validateUploadedFile } from "./upload";

const PEOPLE_REQUIRED_HEADERS: string[] = PERSON_HEADERS;
const ALLOWED_ROLES: Role[] = ROLES.filter((role) => role !== "admin");
const ALLOWED_SUBTEAMS: Subteam[] = SUBTEAMS;
const ALLOWED_GRADES: Grade[] = GRADES;
const MAX_FIELD_LENGTH = 255;

async function validatePeopleFrontend(file: File): Promise<{
  errors: string[];
  people: any[];
}> {
  const { errors: uploadErrors, parsed } = await validateUploadedFile(file);
  if (uploadErrors.length > 0 || !parsed) return { errors: uploadErrors, people: [] };
  const errors: string[] = [];
  const people: any[] = [];

  const headerErrors = checkRequiredHeaders(parsed.headers, PEOPLE_REQUIRED_HEADERS);
  if (headerErrors.length > 0) {
    errors.push(...headerErrors);
    return { errors, people };
  }

  for (let i = 0; i < parsed.rows.length; i++) {
    const rowErrors: string[] = [];
    const row = parsed.rows[i];
    const countError = checkColumnCount(row, parsed.headers.length);
    if (countError) {
      rowErrors.push(countError);
      errors.push("errors for row " + (i + 1) + ": " + rowErrors.join(", "));
      continue;
    }

    const person = { ...PERSON_OBJECT };
    person.fullName = row[0] || "";
    person.email = row[1] || "";
    person.phone = row[2] || "";
    person.role = row[3] || "";
    person.subteam = row[4] || "";
    person.school = row[5] || "";
    person.grade = row[6] || "";
    person.company = row[7] || "";

    const REQUIRED_FIELDS: string[] = ["fullName", "email", "role"];
    for (const field of REQUIRED_FIELDS) {
      if (!person[field as keyof Person]) rowErrors.push(`${field} is required`);
    }
    if (person.role === "staff" && !person.subteam) rowErrors.push("Subteam is required");
    if (rowErrors.length > 0) {
      errors.push("errors for row " + (i + 1) + ": " + rowErrors.join(", "));
      continue;
    }

    const BOUND_CHECK_FIELDS: string[] = ["fullName", "email", "phone", "company", "school"];
    for (const field of BOUND_CHECK_FIELDS) {
      if (person[field] && person[field].length > MAX_FIELD_LENGTH)
        rowErrors.push(`${field} must be less than ${MAX_FIELD_LENGTH} characters`);
    }
    if (rowErrors.length > 0) {
      errors.push("errors for row " + (i + 1) + ": " + rowErrors.join(", "));
      continue;
    }

    if (person.email && !isValidEmail(person.email)) rowErrors.push("Invalid email address");
    if (person.phone && !isValidPhone(person.phone)) rowErrors.push("Invalid phone number");
    if (person.role && !ALLOWED_ROLES.includes(person.role)) rowErrors.push("Invalid role");
    if (person.subteam && !ALLOWED_SUBTEAMS.includes(person.subteam)) rowErrors.push("Invalid subteam");
    if (person.grade && !ALLOWED_GRADES.includes(person.grade as Grade)) rowErrors.push("Invalid grade");
    if (rowErrors.length > 0) {
      errors.push("errors for row " + (i + 1) + ": " + rowErrors.join(", "));
      continue;
    }

    people.push(person);
  }

  return { errors, people };
}

async function validatePeopleBackend(file: File): Promise<{ errors: string[]; people: any[] }> {
  const errors: string[] = [];
  const { errors: frontendErrors, people } = await validatePeopleFrontend(file);
  errors.push(...frontendErrors);
  return { errors, people };
}

export { validatePeopleFrontend, validatePeopleBackend };
