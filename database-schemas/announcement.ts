import { email, z } from "zod";

const announcementSchema = z.object({
  createdAt: z.number(),
  updatedAt: z.number(),

  channel: z.string(),
  visibility: z.string(),
  title: z.string(),
  message: z.string(),

  email: z.string().email().optional(),
  fullName: z.string().optional(),
  role: z.enum(["attendee", "staff", "admin"]),
  subteam: z.array(z.string()),
  uid: z.string(),
});

export type Announcement = z.infer<typeof announcementSchema>;
