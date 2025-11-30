import { z } from "zod";

const qrCodeSchema = z.object({
  createdAt: z.number(),
  updatedAt: z.number(),

  fullName: z.string().optional(),
  email: z.string().email(),
  url: z.string().url(),
});

export type QRCode = z.infer<typeof qrCodeSchema>;