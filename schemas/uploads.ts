export type Role = "attendee" | "staff" | "admin";

export interface QRCode {
  fullName?: string;
  email?: string;

  url?: string;
}

export interface RoomAssignment {
  email?: string;
  fullName?: string;

  roomNumber?: string;
  details?: string;
}

export interface ScheduleEventAssignment {
  email?: string;
  fullName?: string;
  subteam?: string;

  day?: string;
  startTime?: string;
  endTime?: string;

  room?: string;
  zoomUrl?: string;

  title?: string;
  description?: string;
  speaker?: string;
}

export interface Person {
  fullName?: string;
  email?: string;
  phone?: string;

  role?: Role;
  subteam?: string;

  school?: string;
  grade?: string;
  company?: string;
}
