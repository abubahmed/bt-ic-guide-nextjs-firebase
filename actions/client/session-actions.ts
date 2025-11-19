"use client";

export const createSession = async (idToken: string) => {
  await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: idToken }),
    credentials: "include",
  });
};
