// validators/peopleValidator.ts

import { checkRequiredHeaders, checkColumnCount, isValidEmail, isValidPhone } from "./utils";
import { ROLES, SUBTEAMS, GRADES, Role, Subteam, Grade } from "@/schemas/database";
import { Person, PERSON_HEADERS, PERSON_OBJECT } from "@/schemas/uploads";

const PEOPLE_REQUIRED_HEADERS: string[] = PERSON_HEADERS;
const ALLOWED_ROLES: Role[] = ROLES.filter((role) => role !== "admin");
const ALLOWED_SUBTEAMS: Subteam[] = SUBTEAMS;
const ALLOWED_GRADES: Grade[] = GRADES;
const MAX_FIELD_LENGTH = 255;

async function validatePersonFrontend(person: Person): Promise<string[]> {
  const errors: string[] = [];

  const REQUIRED_FIELDS: string[] = ["fullName", "email", "role"];
  for (const field of REQUIRED_FIELDS) {
    if (!person[field as keyof Person]) errors.push(`${field} is required`);
  }
  if (person.role === "staff" && !person.subteam) errors.push("Subteam is required");
  if (errors.length > 0) return errors;

  const BOUND_CHECK_FIELDS: string[] = ["fullName", "email", "phone", "company", "school"];
  for (const field of BOUND_CHECK_FIELDS) {
    // @ts-ignore
    if (person[field as keyof Person] && person[field as keyof Person].length > MAX_FIELD_LENGTH)
      errors.push(`${field} must be less than ${MAX_FIELD_LENGTH} characters`);
  }
  if (errors.length > 0) return errors;

  if (person.email && !isValidEmail(person.email)) errors.push("Invalid email address");
  if (person.phone && !isValidPhone(person.phone)) errors.push("Invalid phone number");
  if (person.role && !ALLOWED_ROLES.includes(person.role)) errors.push("Invalid role");
  if (person.subteam && !ALLOWED_SUBTEAMS.includes(person.subteam)) errors.push("Invalid subteam");
  if (person.grade && !ALLOWED_GRADES.includes(person.grade as Grade)) errors.push("Invalid grade");
  if (errors.length > 0) return errors;

  return errors;
}

async function validatePersonsFrontend(parsed: any): Promise<{
  errors: string[];
  people: any[];
}> {
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

    const personErrors = await validatePersonFrontend(person);
    if (personErrors.length > 0) {
      errors.push("errors for row " + (i + 1) + ": " + personErrors.join(", "));
      continue;
    } else {
      people.push(person);
    }
  }

  return { errors, people };
}

async function validatePersonBackend(person: Person): Promise<string[]> {
  const errors: string[] = [];
  const personErrors = await validatePersonFrontend(person);
  if (personErrors.length > 0) {
    errors.push(...personErrors);
  }
  return errors;
}

async function validatePersonsBackend(parsed: any): Promise<{ errors: string[]; people: any[] }> {
  const errors: string[] = [];
  const { errors: frontendErrors, people } = await validatePersonsFrontend(parsed);
  errors.push(...frontendErrors);
  return { errors, people };
}

export { validatePersonsFrontend, validatePersonsBackend, validatePersonBackend, validatePersonFrontend };
