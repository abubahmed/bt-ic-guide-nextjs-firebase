import { z } from "zod";

const helpRequestSchema = z.object({
  createdAt: z.number(),
  updatedAt: z.number(),

  helpType: z.string().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
  details: z.string().optional(),

  email: z.string().email(),
  fullName: z.string().optional(),
  role: z.enum(["attendee", "staff", "admin"]),
  subteam: z.string().optional(),
  uid: z.string(),
});

export type HelpRequest = z.infer<typeof helpRequestSchema>;
