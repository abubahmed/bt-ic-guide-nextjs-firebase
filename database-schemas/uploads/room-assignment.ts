import { z } from "zod";

const roomAssignmentSchema = z.object({
  createdAt: z.number(),
  updatedAt: z.number(),

  email: z.string().email(),
  fullName: z.string().optional(),
  roomNumber: z.string(),
  details: z.string().optional(),
});

export type RoomAssignment = z.infer<typeof roomAssignmentSchema>;
