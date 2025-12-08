/**
 * @file people-actions.ts
 * @description Client-side people actions for Firebase Auth.
 * @module actions/people/client
 */

"use client";

import { getCurrentUser } from "@/lib/firebase/client/auth";
import { getSessionUser } from "../session-actions";

const PEOPLE_ROUTE = "/api/staff/people";

/*
Fetch people dataset from server side.

@returns { User[] | null }
*/
export const fetchPeopleActionClient = async () => {
  const currentUser = await getCurrentUser();
  console.log("currentUser", currentUser);
  if (!currentUser) {
    console.error("User is not signed in in fetchPeopleActionClient.");
    return;
  }
  const sessionUser = await getSessionUser();
  console.log("sessionUser", sessionUser);
  if (!sessionUser) {
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
