// schemas/uploads.ts

// ------------------------------------------------------------------- //
// Types

import { Role, Subteam } from "./database";

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
  subteam?: Subteam;

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
  subteam?: Subteam;

  school?: string;
  grade?: string;
  company?: string;
}

// ------------------------------------------------------------------- //
// Constants

const QR_CODE_OBJECT: QRCode | any = {
  fullName: "",
  email: "",
  url: "",
};

const ROOM_ASSIGNMENT_OBJECT: RoomAssignment | any = {
  email: "",
  fullName: "",
  roomNumber: "",
  details: "",
};

const SCHEDULE_EVENT_ASSIGNMENT_OBJECT: ScheduleEventAssignment | any = {
  email: "",
  fullName: "",
  subteam: "",
  day: "",
  startTime: "",
  endTime: "",
  room: "",
  zoomUrl: "",
  title: "",
  description: "",
  speaker: "",
};

const PERSON_OBJECT: Person | any = {
  fullName: "",
  email: "",
  phone: "",
  role: "",
  subteam: "",
  school: "",
  grade: "",
  company: "",
};

export { QR_CODE_OBJECT, ROOM_ASSIGNMENT_OBJECT, SCHEDULE_EVENT_ASSIGNMENT_OBJECT, PERSON_OBJECT };

// ------------------------------------------------------------------- //
// Constants

const PERSON_HEADERS: string[] = ["full_name", "email", "phone", "role", "subteam", "school", "grade", "company"];
const QR_CODE_HEADERS: string[] = ["full_name", "email", "url"];
const ROOM_ASSIGNMENT_HEADERS: string[] = ["email", "full_name", "room_number", "details"];
const SCHEDULE_EVENT_ASSIGNMENT_HEADERS: string[] = [
  "email",
  "full_name",
  "subteam",
  "day",
  "start_time",
  "end_time",
  "room",
  "zoom_url",
  "title",
  "description",
  "speaker",
];

export { PERSON_HEADERS, QR_CODE_HEADERS, ROOM_ASSIGNMENT_HEADERS, SCHEDULE_EVENT_ASSIGNMENT_HEADERS };