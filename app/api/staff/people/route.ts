import { NextResponse } from "next/server";
import { getSessionUser } from "@/actions/session-actions";
import { getUserProfile, getUserProfiles } from "@/lib/firebase/server/users";
import { createPerson } from "@/lib/firebase/server/people";
import { Subteam, Role, Grade } from "@/schemas/database";

const MAX_UPLOAD_SIZE_MB = 10;
const MAX_FIELD_LENGTH = 255;

const REQUIRED_PERSONS_HEADERS = ["full_name", "email", "phone", "role", "subteam", "school", "grade", "company"];
const BOUND_CHECK_FIELDS = ["fullName", "email", "phone", "company", "school"];
const REQUIRED_INDIVIDUAL_FIELDS = ["fullName", "email", "role"];

const VALID_SUBTEAMS: Subteam[] = ["logistics", "registration", "technology", "security", "operations", "finance"];
const VALID_ROLES: Role[] = ["attendee", "staff"];
const VALID_GRADES: Grade[] = ["freshman", "sophomore", "junior", "senior", "graduate", "other"];

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserProfile(sessionUser.uid);
  if (user.role !== "admin" || user.accessStatus !== "active") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const people = await getUserProfiles();
  return NextResponse.json({ people });
}

export async function POST(request: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserProfile(sessionUser.uid);
  if (user.role !== "admin" || user.accessStatus !== "active") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") || "";
  if (contentType.startsWith("application/json")) {
    return handleIndividualUpload(request);
  }

  if (contentType.startsWith("multipart/form-data")) {
    const form = await request.formData();
    const scope = form.get("scope") as string | null;

    if (scope === "group") {
      return handleGroupUpload(request);
    } else if (scope === "master") {
      return handleMasterUpload(request);
    }
  }

  return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
}

const handleGroupUpload = async (request: Request) => {
  const form = await request.formData();
  const groupRole = form.get("groupRole") as string;
  const groupSubteam = form.get("groupSubteam") as string;
  const file = form.get("file") as File;
  const errors = await handleRunGroupValidations({ groupRole, groupSubteam, file });
};

const handleMasterUpload = async (request: Request) => {
  const form = await request.formData();
  const file = form.get("file") as File;
  const errors = await handleRunMasterValidations({ file });
};

const handleIndividualUpload = async (request: Request) => {
  const body = await request.json();
  const errors = await handleRunIndividualValidations({ individualForm: body });
};

const handleRunIndividualValidations = async ({ individualForm }: { individualForm?: any }) => {
  let errors: string[] = [];
  for (const field of REQUIRED_INDIVIDUAL_FIELDS) {
    const value = individualForm[field as keyof any];
    if (!value) errors.push(`${field} is required`);
  }

  if (!VALID_ROLES.includes(individualForm.role as Role)) errors.push(`Invalid role: ${individualForm.role}`);
  if (!VALID_SUBTEAMS.includes(individualForm.subteam as Subteam))
    errors.push(`Invalid subteam: ${individualForm.subteam}`);
  if (!VALID_GRADES.includes(individualForm.grade as Grade)) errors.push(`Invalid grade: ${individualForm.grade}`);

  if (individualForm.role === "staff" && !individualForm.subteam) {
    errors.push("Subteam is required");
  }
  if (individualForm.email && !individualForm.email.includes("@")) {
    errors.push("Invalid email address");
  }
  if (individualForm.phone && !individualForm.phone.match(/^\d{10}$/)) {
    errors.push("Invalid phone number");
  }

  for (const field of BOUND_CHECK_FIELDS) {
    const value = individualForm[field as keyof any];
    if (value && value.length > MAX_FIELD_LENGTH) {
      errors.push(`${field} must be less than ${MAX_FIELD_LENGTH} characters`);
    }
  }

  return errors;
};

const handleRunGroupValidations = async ({
  groupRole,
  groupSubteam,
  file,
}: {
  groupRole: string;
  groupSubteam: string;
  file: File;
}) => {
  let errors: string[] = [];
  if (!groupRole) errors.push("Role is required");
  if (groupRole === "staff" && !groupSubteam) errors.push("Subteam is required");
  if (!file) errors.push("File is required");
  if (errors.length > 0) return errors;

  const name = file.name.toLowerCase();
  if (!name.endsWith(".csv")) errors.push("Only .csv files are allowed");
  if (file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) errors.push(`File size exceeds ${MAX_UPLOAD_SIZE_MB}MB`);
  if (errors.length > 0) return errors;

  const csvText: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });

  if (!csvText.trim()) {
    errors.push("CSV file is empty");
    return errors;
  }

  const lines = csvText.trim().replace(/\r/g, "").split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());
  for (const h of REQUIRED_PERSONS_HEADERS) {
    if (!headers.includes(h)) errors.push(`Missing required column: ${h}`);
  }
  if (errors.length > 0) return errors;

  for (const line of lines.slice(1)) {
    const values = line.split(",").map((v) => v.trim());
    if (values.length !== headers.length) {
      errors.push(`Invalid number of columns in line: ${line}`);
      continue;
    }

    const person = {
      fullName: values[0],
      email: values[1],
      phone: values[2],
      role: values[3],
      subteam: values[4],
      school: values[5],
      grade: values[6],
      company: values[7],
    };
    if (person.role != groupRole) errors.push(`Invalid role in line: ${line}`);
    if (person.role === "staff" && person.subteam != groupSubteam) errors.push(`Invalid subteam in line: ${line}`);
    const rowErrors = await handleRunIndividualValidations({ individualForm: person });
    if (rowErrors.length > 0) errors.push(...rowErrors);
  }

  return errors;
};

const handleRunMasterValidations = async ({ file }: { file: File }) => {
  let errors: string[] = [];
  if (!file) {
    errors.push("File is required");
    return errors;
  }

  const name = file.name.toLowerCase();
  if (!name.endsWith(".csv")) errors.push("Only .csv files are allowed");
  if (file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) errors.push(`File size exceeds ${MAX_UPLOAD_SIZE_MB}MB`);
  if (errors.length > 0) return errors;

  let csvText: string = "";
  csvText = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error as Error);
    reader.readAsText(file);
  });

  if (!csvText.trim()) {
    errors.push("CSV file is empty");
    return errors;
  }

  const lines = csvText.trim().replace(/\r/g, "").split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());
  for (const h of REQUIRED_PERSONS_HEADERS) {
    if (!headers.includes(h)) errors.push(`Missing required column: ${h}`);
  }
  if (errors.length > 0) return errors;

  for (const line of lines.slice(1)) {
    const values = line.split(",").map((v) => v.trim());
    if (values.length !== headers.length) {
      errors.push(`Invalid number of columns in line: ${line}`);
      continue;
    }

    const person = {
      fullName: values[0],
      email: values[1],
      phone: values[2],
      role: values[3],
      subteam: values[4],
      school: values[5],
      grade: values[6],
      company: values[7],
    };
    const rowErrors = await handleRunIndividualValidations({ individualForm: person });
    if (rowErrors.length > 0) errors.push(...rowErrors);
  }

  return errors;
};
