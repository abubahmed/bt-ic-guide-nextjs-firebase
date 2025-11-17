interface AttendeeInvite {
  email: string;
  fullName: string;
  affiliation: string;
  notes: string;
}

interface StaffInvite {
  princetonEmail: string;
  fullName: string;
  team: string;
  notes: string;
}

export type { AttendeeInvite, StaffInvite };
