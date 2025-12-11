/**
 * @file people-actions.ts
 * @description Client-side people actions for Firebase Auth.
 * @module actions/people/client
 */

"use client";

import { getCurrentUser } from "@/lib/firebase/client/auth";
import { getSessionUser } from "../session-actions";
import { Person } from "@/schemas/uploads";
import { validatePersonFrontend, validatePersonsFrontend } from "@/validators/persons";

const PEOPLE_ROUTE = "/api/staff/people";

/*
Fetch people dataset from server side.

@returns { User[] | null }
*/
export const fetchPeopleActionClient = async () => {
  if (!(await getCurrentUser()) || !(await getSessionUser())) {
    console.error("User is not signed in in fetchPeopleActionClient.");
    return;
  }

  try {
    const response = await fetch(PEOPLE_ROUTE, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      console.error("Failed to fetch people in fetchPeopleActionClient:", response.statusText);
      return;
    }
    const data = await response.json();
    return data.people;
  } catch (error) {
    console.error("Error fetching people in fetchPeopleActionClient:", error);
    return;
  }
};

/*
Upload people dataset from file to server side.

@param file: File
@returns { boolean | null }
*/
export const stageFileUploadActionClient = async (file: File) => {
  if (!(await getCurrentUser()) || !(await getSessionUser())) {
    console.error("User is not signed in in stageFileUploadActionClient.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(PEOPLE_ROUTE, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (!response.ok) {
      console.error("Failed to upload people dataset in stageFileUploadActionClient:", response.statusText);
      return;
    }
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error staging file upload in stageFileUploadActionClient:", error);
    return;
  }
};

/*
Upload individual person to server side.

@param form: any
@returns { boolean | null }
*/
export const stageIndividualUploadActionClient = async (form: Person) => {
  if (!(await getCurrentUser()) || !(await getSessionUser())) {
    console.error("User is not signed in in stageFileUploadActionClient.");
    return;
  }

  try {
    const response = await fetch(PEOPLE_ROUTE, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(form),
    });
    if (!response.ok) {
      console.error("Failed to stage individual upload in stageIndividualUploadActionClient:", response.statusText);
      return;
    }
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error staging individual upload in stageIndividualUploadActionClient:", error);
    return;
  }
};
