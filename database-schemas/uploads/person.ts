import { z } from "zod";

const personSchema = z.object({
  createdAt: z.number(),
  updatedAt: z.number(),

  fullName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),

  role: z.enum(["attendee", "staff", "admin"]),
  subteam: z.string().optional(),
  school: z.string().optional(),
  grade: z.string().optional(),
  company: z.string().optional(),
});

export type Person = z.infer<typeof personSchema>;
