import { z } from "zod";

const scheduleEventAssignmentSchema = z.object({
  createdAt: z.number(),
  updatedAt: z.number(),

  email: z.string().email(),
  fullName: z.string().optional(),
  subteam: z.string().optional(),

  day: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  room: z.string().optional(),
  zoomUrl: z.string().optional(),

  title: z.string().optional(),
  description: z.string().optional(),
  speaker: z.string().optional(),
});

export type ScheduleEventAssignment = z.infer<typeof scheduleEventAssignmentSchema>;
