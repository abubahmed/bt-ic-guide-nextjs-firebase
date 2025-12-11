import { NextResponse } from "next/server";
import { getSessionUser } from "@/actions/session-actions";
import { getUserProfile, getUserProfiles } from "@/lib/firebase/server/users";
import { createPerson, createPersons } from "@/lib/firebase/server/people";
import { validatePersonBackend, validatePersonsBackend } from "@/validators/persons";
import { Person } from "@/schemas/uploads";
import { validateUploadedFile } from "@/validators/upload";

export async function GET() {
  try {
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
  } catch (error) {
    console.error("Error fetching people:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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
      return await handleIndividualUpload(request);
    }

    if (contentType.startsWith("multipart/form-data")) {
      return await handleSpreadsheetUpload(request);
    }

    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  } catch (error) {
    console.error("Error staging upload:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const handleIndividualUpload = async (request: Request) => {
  const body = await request.json();
  const person = {
    fullName: body.fullName,
    email: body.email,
    phone: body.phone,
    role: body.role,
    subteam: body.subteam,
    school: body.school,
    grade: body.grade,
    company: body.company,
  } as Person;

  const errors = await validatePersonBackend(person);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors }, { status: 400 });
  }
  const createdPerson = await createPerson(person);
  return NextResponse.json({ createdPerson });
};

const handleSpreadsheetUpload = async (request: Request) => {
  const form = await request.formData();
  const file = form.get("file") as File;

  const { errors: uploadErrors, parsed } = await validateUploadedFile(file as File);
  if (uploadErrors.length > 0) {
    return NextResponse.json({ error: uploadErrors }, { status: 400 });
  }
  const { errors: personsErrors, people } = await validatePersonsBackend(parsed);
  if (personsErrors.length > 0) {
    return NextResponse.json({ error: personsErrors }, { status: 400 });
  }

  const createdPeople = await createPersons(people);
  return NextResponse.json({ createdPeople });
};
