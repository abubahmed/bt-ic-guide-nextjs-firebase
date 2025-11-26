import { z } from "zod";

const resourceSchema = z.object({
  createdAt: z.number(),
  updatedAt: z.number(),

  title: z.string(),
  type: z.enum(["file", "url"]),
  url: z.string().url().optional(),
  visibility: z.enum(["staff", "attendee", "shared"]),

  email: z.string().email().optional(),
  fullName: z.string().optional(),
  role: z.enum(["attendee", "staff", "admin"]),
  subteam: z.string().optional(),
  uid: z.string(),
});

export type Resource = z.infer<typeof resourceSchema>;
