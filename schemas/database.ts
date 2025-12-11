// schemas/database.ts

// ------------------------------------------------------------------- //
// Types

type Role = "attendee" | "staff" | "admin";
type AccessStatus = "active" | "invited" | "revoked";
type Grade = "freshman" | "sophomore" | "junior" | "senior" | "graduate" | "other";

type Visibility = "staff" | "attendee" | "shared";
type ResourceType = "file" | "url";

type HelpRequestType = "question" | "assistance" | "emergency" | "other";
type HelpRequestPriority = "low" | "medium" | "high";
type HelpRequestStatus = "pending" | "resolved" | "failure";

type AnnouncementChannel = "email" | "website";
type Subteam = "logistics" | "registration" | "technology" | "security" | "operations" | "finance"

export type {
  Role,
  AccessStatus,
  Grade,
  Visibility,
  ResourceType,
  HelpRequestType,
  HelpRequestPriority,
  HelpRequestStatus,
  AnnouncementChannel,
  Subteam,
};

interface User {
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
  accessStatus?: AccessStatus;
  fullName?: string;
  subteam?: Subteam;

  school?: string;
  grade?: Grade;
  company?: string;

  eventIds?: Array<string>;
  roomNumber?: string;
  qrCode?: string;
  helpRequests?: Array<string>;
}

interface ScheduleEvent {
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

interface Resource {
  createdAt?: number;
  updatedAt?: number;

  title?: string;
  type?: ResourceType;
  url?: string;
  visibility?: Visibility;

  email?: string;
  fullName?: string;
  role?: Role;
  subteam?: Subteam;
  uid?: string;
}

interface HelpRequest {
  createdAt?: number;
  updatedAt?: number;

  helpType?: HelpRequestType;
  priority?: HelpRequestPriority;
  status?: HelpRequestStatus;
  details?: string;

  email?: string;
  fullName?: string;
  role?: Role;
  subteam?: Subteam;
  uid?: string;
}

interface Announcement {
  createdAt?: number;
  updatedAt?: number;

  channel?: AnnouncementChannel;
  visibility?: Visibility;
  title?: string;
  message?: string;

  email?: string;
  fullName?: string;
  role?: Role;
  subteam?: Subteam;
  uid?: string;
}

export type { User, ScheduleEvent, Resource, HelpRequest, Announcement };

// ------------------------------------------------------------------- //
// Constants

const ROLES: Role[] = ["attendee", "staff", "admin"];
const ACCESS_STATUSES: AccessStatus[] = ["active", "invited", "revoked"];
const GRADES: Grade[] = ["freshman", "sophomore", "junior", "senior", "graduate", "other"];
const VISIBILITIES: Visibility[] = ["staff", "attendee", "shared"];
const RESOURCE_TYPES: ResourceType[] = ["file", "url"];
const HELP_REQUEST_TYPES: HelpRequestType[] = ["question", "assistance", "emergency", "other"];
const HELP_REQUEST_PRIORITIES: HelpRequestPriority[] = ["low", "medium", "high"];
const HELP_REQUEST_STATUSES: HelpRequestStatus[] = ["pending", "resolved", "failure"];
const ANNOUNCEMENT_CHANNELS: AnnouncementChannel[] = ["email", "website"];
const SUBTEAMS: Subteam[] = ["logistics", "registration", "technology", "security", "operations", "finance"];

export {
  ROLES,
  ACCESS_STATUSES,
  GRADES,
  VISIBILITIES,
  RESOURCE_TYPES,
  HELP_REQUEST_TYPES,
  HELP_REQUEST_PRIORITIES,
  HELP_REQUEST_STATUSES,
  ANNOUNCEMENT_CHANNELS,
  SUBTEAMS,
};

const USER_OBJECT: User | any = {
  createdAt: new Date().getTime(),
  updatedAt: new Date().getTime(),
  displayName: "",
  email: "",
  emailVerified: false,
  photoURL: "",
  phoneNumber: "",
  providerId: "",
  uid: "",
  role: null,
  accessStatus: null,
  fullName: null,
  subteam: null,
  school: null,
  grade: null,
  company: null,
  eventIds: [],
  roomNumber: null,
  qrCode: null,
  helpRequests: [],
};

const SCHEDULE_EVENT_OBJECT: ScheduleEvent | any = {
  createdAt: new Date().getTime(),
  updatedAt: new Date().getTime(),
  uids: [],
  day: "",
  startTime: "",
  endTime: "",
  room: "",
  zoomUrl: "",
  title: "",
  description: "",
  speaker: "",
};

const RESOURCE_OBJECT: Resource | any = {
  createdAt: new Date().getTime(),
  updatedAt: new Date().getTime(),
  title: "",
  type: null,
  url: "",
  visibility: null,
  email: "",
  fullName: "",
  role: null,
  subteam: null,
  uid: "",
};

const HELP_REQUEST_OBJECT: HelpRequest | any = {
  createdAt: new Date().getTime(),
  updatedAt: new Date().getTime(),
  helpType: null,
  priority: null,
  status: null,
  details: "",
  email: "",
  fullName: "",
  role: null,
  subteam: null,
  uid: "",
};

const ANNOUNCEMENT_OBJECT: Announcement | any = {
  createdAt: new Date().getTime(),
  updatedAt: new Date().getTime(),
  channel: null,
  visibility: null,
  title: "",
  message: "",
  email: "",
  fullName: "",
  role: null,
  subteam: null,
  uid: "",
};

export { USER_OBJECT, SCHEDULE_EVENT_OBJECT, RESOURCE_OBJECT, HELP_REQUEST_OBJECT, ANNOUNCEMENT_OBJECT };
