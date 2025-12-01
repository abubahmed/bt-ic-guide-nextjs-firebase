const subteams = [
  { id: "operations", label: "Operations" },
  { id: "programming", label: "Programming" },
  { id: "hospitality", label: "Hospitality" },
  { id: "security", label: "Security" },
  { id: "logistics", label: "Logistics" },
] as const;

const roles = ["staff", "attendee", "admin"] as const;

const gradeOptions = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate", "Other"] as const;

type SubteamId = (typeof subteams)[number]["id"];
type PersonRole = (typeof roles)[number];
type GradeValue = (typeof gradeOptions)[number];

type PersonRecord = {
  id: string;
  fullName: string;
  role: PersonRole;
  email: string;
  phone: string;
  company: string;
  school: string;
  grade: GradeValue;
  subteam?: SubteamId;
};

const peopleDirectory: PersonRecord[] = [
  {
    id: "alex-chen",
    fullName: "Alex Chen",
    role: "staff",
    subteam: "operations",
    email: "alex.chen@btic.co",
    phone: "+1 (555) 201-1102",
    company: "BTIC Ops",
    school: "Princeton University",
    grade: "Senior",
  },
  {
    id: "maya-patel",
    fullName: "Maya Patel",
    role: "staff",
    subteam: "programming",
    email: "maya.patel@btic.co",
    phone: "+1 (555) 201-3304",
    company: "BTIC Programming",
    school: "Stanford University",
    grade: "Graduate",
  },
  {
    id: "leo-carter",
    fullName: "Leo Carter",
    role: "staff",
    subteam: "hospitality",
    email: "leo.carter@btic.co",
    phone: "+1 (555) 201-9876",
    company: "BTIC Hospitality",
    school: "Cornell University",
    grade: "Senior",
  },
  {
    id: "lara-cho",
    fullName: "Lara Cho",
    role: "staff",
    subteam: "security",
    email: "lara.cho@btic.co",
    phone: "+1 (555) 201-7654",
    company: "BTIC Security",
    school: "Columbia University",
    grade: "Graduate",
  },
  {
    id: "opal-reed",
    fullName: "Opal Reed",
    role: "staff",
    subteam: "logistics",
    email: "opal.reed@btic.co",
    phone: "+1 (555) 201-0033",
    company: "BTIC Logistics",
    school: "Georgetown University",
    grade: "Senior",
  },
  {
    id: "natalie-young",
    fullName: "Natalie Young",
    role: "attendee",
    email: "natalie.young@btic.co",
    phone: "+1 (555) 201-4421",
    company: "Attendee",
    school: "University of Michigan",
    grade: "Junior",
  },
  {
    id: "jamie-bowen",
    fullName: "Jamie Bowen",
    role: "attendee",
    email: "jamie.bowen@btic.co",
    phone: "+1 (555) 201-1188",
    company: "Attendee",
    school: "Northwestern University",
    grade: "Senior",
  },
  {
    id: "dahlia-ortiz",
    fullName: "Dahlia Ortiz",
    role: "staff",
    subteam: "operations",
    email: "dahlia.ortiz@btic.co",
    phone: "+1 (555) 201-7878",
    company: "BTIC Ops",
    school: "Brown University",
    grade: "Junior",
  },
  {
    id: "kofi-diaz",
    fullName: "Kofi Diaz",
    role: "staff",
    subteam: "security",
    email: "kofi.diaz@btic.co",
    phone: "+1 (555) 201-9090",
    company: "BTIC Security",
    school: "Rutgers University",
    grade: "Graduate",
  },
  {
    id: "priya-iyer",
    fullName: "Priya Iyer",
    role: "attendee",
    email: "priya.iyer@btic.co",
    phone: "+1 (555) 201-4455",
    company: "Attendee",
    school: "Duke University",
    grade: "Sophomore",
  },
  {
    id: "renee-yang",
    fullName: "Renee Yang",
    role: "attendee",
    email: "renee.yang@btic.co",
    phone: "+1 (555) 201-7755",
    company: "Attendee",
    school: "Yale University",
    grade: "Junior",
  },
  {
    id: "samir-holt",
    fullName: "Samir Holt",
    role: "staff",
    subteam: "logistics",
    email: "samir.holt@btic.co",
    phone: "+1 (555) 201-2299",
    company: "BTIC Logistics",
    school: "NYU",
    grade: "Graduate",
  },
  {
    id: "ivy-lam",
    fullName: "Ivy Lam",
    role: "admin",
    email: "ivy.lam@btic.co",
    phone: "+1 (555) 201-5566",
    company: "BTIC HQ",
    school: "Harvard University",
    grade: "Graduate",
  },
  {
    id: "ethan-brooks",
    fullName: "Ethan Brooks",
    role: "staff",
    subteam: "operations",
    email: "ethan.brooks@btic.co",
    phone: "+1 (555) 201-6677",
    company: "BTIC Ops",
    school: "MIT",
    grade: "Graduate",
  },
  {
    id: "noor-kamal",
    fullName: "Noor Kamal",
    role: "attendee",
    email: "noor.kamal@btic.co",
    phone: "+1 (555) 201-8844",
    company: "Attendee",
    school: "UCLA",
    grade: "Senior",
  },
];

export type { PersonRecord, PersonRole, SubteamId, GradeValue };
export { subteams, roles, gradeOptions, peopleDirectory };
