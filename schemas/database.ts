export type Role = "attendee" | "staff" | "admin";

export type Visibility = "staff" | "attendee" | "shared";
export type ResourceType = "file" | "url";

export type HelpRequestType = "question" | "assistance" | "emergency" | "other";
export type HelpRequestPriority = "low" | "medium" | "high";
export type HelpRequestStatus = "pending" | "resolved" | "failure";

export type AnnouncementChannel = "email" | "website";

export interface User {
  createdAt?: number;
  updatedAt?: number;

  displayName?: string;
  email?: string;
  emailVerified?: boolean;
  photoURL?: string;
  phoneNumber?: string;
  providerId?: string;
  uid?: string;

  role?: Role;
  fullName?: string;
  subteam?: Array<string>;

  school?: string;
  grade?: string;
  company?: string;

  eventIds?: Array<string>;
  roomNumber?: string;
  qrCode?: string;
  helpRequests?: Array<string>;
}

export interface ScheduleEvent {
  createdAt?: number;
  updatedAt?: number;
  uids?: Array<string>;

  day?: string;
  startTime?: string;
  endTime?: string;

  room?: string;
  zoomUrl?: string;

  title?: string;
  description?: string;
  speaker?: string;
}

export interface Resource {
  createdAt?: number;
  updatedAt?: number;

  title?: string;
  type?: ResourceType;
  url?: string;
  visibility?: Visibility;

  email?: string;
  fullName?: string;
  role?: Role;
  subteam?: string;
  uid?: string;
}

export interface HelpRequest {
  createdAt?: number;
  updatedAt?: number;

  helpType?: HelpRequestType;
  priority?: HelpRequestPriority;
  status?: HelpRequestStatus;
  details?: string;

  email?: string;
  fullName?: string;
  role?: Role;
  subteam?: string;
  uid?: string;
}

export interface Announcement {
  createdAt?: number;
  updatedAt?: number;

  channel?: AnnouncementChannel;
  visibility?: Visibility;
  title?: string;
  message?: string;

  email?: string;
  fullName?: string;
  role?: Role;
  subteam?: Array<string>;
  uid?: string;
}
