import { z } from "zod";

const scheduleEventSchema = z.object({
  createdAt: z.number(),
  updatedAt: z.number(),
  uids: z.array(z.string()),

  day: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  room: z.string().optional(),
  zoomUrl: z.string().optional(),

  title: z.string().optional(),
  description: z.string().optional(),
  speaker: z.string().optional(),
});

export type ScheduleEvent = z.infer<typeof scheduleEventSchema>;
