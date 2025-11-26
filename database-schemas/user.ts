import { z } from "zod";

const userSchema = z.object({
  createdAt: z.number(),
  updatedAt: z.number(),

  displayName: z.string().optional(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  photoURL: z.string().optional(),
  phoneNumber: z.string().optional(),
  providerId: z.string().optional(),
  uid: z.string(),

  role: z.enum(["attendee", "staff", "admin"]),
  fullName: z.string().optional(),
  subteam: z.array(z.string()),
  school: z.string().optional(),
  grade: z.string().optional(),
  company: z.string().optional(),

  schedule: z.array(z.string()),
  roomNumber: z.string().optional(),
  qrCode: z.string().optional(),
  helpRequests: z.array(z.string()),
});

export type User = z.infer<typeof userSchema>;
