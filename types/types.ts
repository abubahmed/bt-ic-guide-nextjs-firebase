interface AttendeeInvite {
  email: string;
  fullName: string;
  affiliation: string;
  notes: string;
  status: string;
}

interface StaffInvite {
  princetonEmail: string;
  fullName: string;
  team: string;
  notes: string;
  status: string;
}

export type { AttendeeInvite, StaffInvite };
