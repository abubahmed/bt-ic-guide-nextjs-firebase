const teams = [
  { id: "operations", label: "Operations" },
  { id: "programming", label: "Programming" },
  { id: "hospitality", label: "Hospitality" },
  { id: "security", label: "Security" },
  { id: "logistics", label: "Logistics" },
] as const;

type TeamId = (typeof teams)[number]["id"];

type PersonRole = "attendee" | "staff" | "admin";

type PersonRecord = {
  full_name: string;
  email: string;
  phone: string;
  role: PersonRole;
  subteam?: TeamId;
  school?: string;
  grade?: string;
  company?: string;
};

const peopleDirectory: PersonRecord[] = [
  {
    full_name: "Alex Chen",
    email: "alex.chen@btic.co",
    phone: "+1 (555) 010-1001",
    role: "staff",
    subteam: "operations",
    company: "BTIC",
  },
  {
    full_name: "Maya Patel",
    email: "maya.patel@btic.co",
    phone: "+1 (555) 010-1002",
    role: "staff",
    subteam: "programming",
    company: "BTIC",
  },
  {
    full_name: "Leo Carter",
    email: "leo.carter@btic.co",
    phone: "+1 (555) 010-1003",
    role: "staff",
    subteam: "hospitality",
    company: "BTIC",
  },
  {
    full_name: "Lara Cho",
    email: "lara.cho@btic.co",
    phone: "+1 (555) 010-1004",
    role: "staff",
    subteam: "security",
    company: "BTIC",
  },
  {
    full_name: "Opal Reed",
    email: "opal.reed@btic.co",
    phone: "+1 (555) 010-1005",
    role: "staff",
    subteam: "logistics",
    company: "BTIC",
  },
  {
    full_name: "Natalie Young",
    email: "natalie.young@btic.co",
    phone: "+1 (555) 010-1101",
    role: "attendee",
    school: "Brighton Tech",
    grade: "Senior",
  },
  {
    full_name: "Jamie Bowen",
    email: "jamie.bowen@btic.co",
    phone: "+1 (555) 010-1102",
    role: "attendee",
    school: "Brighton Tech",
    grade: "Junior",
  },
  {
    full_name: "Dahlia Ortiz",
    email: "dahlia.ortiz@btic.co",
    phone: "+1 (555) 010-1006",
    role: "staff",
    subteam: "operations",
    company: "BTIC",
  },
  {
    full_name: "Kofi Diaz",
    email: "kofi.diaz@btic.co",
    phone: "+1 (555) 010-1007",
    role: "staff",
    subteam: "security",
    company: "BTIC",
  },
  {
    full_name: "Priya Iyer",
    email: "priya.iyer@btic.co",
    phone: "+1 (555) 010-1103",
    role: "attendee",
    school: "Brighton Tech",
    grade: "Graduate",
  },
  {
    full_name: "Renee Yang",
    email: "renee.yang@btic.co",
    phone: "+1 (555) 010-1104",
    role: "attendee",
    school: "Evergreen College",
    grade: "Sophomore",
  },
  {
    full_name: "Samir Holt",
    email: "samir.holt@btic.co",
    phone: "+1 (555) 010-1008",
    role: "staff",
    subteam: "logistics",
    company: "BTIC",
  },
  {
    full_name: "Ivy Lam",
    email: "ivy.lam@btic.co",
    phone: "+1 (555) 010-1105",
    role: "attendee",
    school: "Evergreen College",
    grade: "Senior",
  },
  {
    full_name: "Ethan Brooks",
    email: "ethan.brooks@btic.co",
    phone: "+1 (555) 010-1009",
    role: "staff",
    subteam: "operations",
    company: "BTIC",
  },
  {
    full_name: "Noor Kamal",
    email: "noor.kamal@btic.co",
    phone: "+1 (555) 010-1106",
    role: "attendee",
    school: "Summit Institute",
    grade: "Senior",
  },
] as const;

export { teams, peopleDirectory };
