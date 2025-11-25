"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, ShieldBan, UploadCloud, UserMinus2, Users2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import StaffFooter from "../components/footer";
import StaffHeader from "../components/header";

const teams = [
  { id: "operations", label: "Operations" },
  { id: "programming", label: "Programming" },
  { id: "hospitality", label: "Hospitality" },
  { id: "security", label: "Security" },
  { id: "logistics", label: "Logistics" },
] as const;

const staffTypes = [
  { id: "ops-command", label: "Ops command lead" },
  { id: "ops-runner", label: "Ops floor runner" },
  { id: "programming-producer", label: "Programming producer" },
  { id: "content-host", label: "Content host" },
  { id: "hospitality-suite", label: "Hospitality suite host" },
  { id: "security-shift", label: "Security shift lead" },
  { id: "logistics-fleet", label: "Logistics fleet chief" },
] as const;

type UploadScope = "master" | "team" | "person";
type ExportScope = "all" | "team" | "person";
type ExportFormat = "csv" | "xlsx";
type AccessRole = "staff" | "attendee";
type PersonStatus = "active" | "invited" | "revoked";
type TeamId = (typeof teams)[number]["id"];
type StaffTypeId = (typeof staffTypes)[number]["id"];

type PersonRecord = {
  id: string;
  name: string;
  email: string;
  team: TeamId;
  accessRole: AccessRole;
  staffType?: StaffTypeId;
  status: PersonStatus;
  source: string;
  lastUpdate: string;
};

const teamLookup = teams.reduce<Record<TeamId, string>>((acc, team) => {
  acc[team.id] = team.label;
  return acc;
}, {} as Record<TeamId, string>);

const staffTypeLookup = staffTypes.reduce<Record<StaffTypeId, string>>((acc, staffType) => {
  acc[staffType.id] = staffType.label;
  return acc;
}, {} as Record<StaffTypeId, string>);

const peopleDirectory: PersonRecord[] = [
  {
    id: "alex-chen",
    name: "Alex Chen",
    email: "alex.chen@btic.co",
    team: "operations",
    accessRole: "staff",
    staffType: "ops-command",
    status: "active",
    source: "Master upload · Clean",
    lastUpdate: "Today · 09:12 AM",
  },
  {
    id: "maya-patel",
    name: "Maya Patel",
    email: "maya.patel@btic.co",
    team: "programming",
    accessRole: "staff",
    staffType: "programming-producer",
    status: "active",
    source: "Team import",
    lastUpdate: "Today · 08:54 AM",
  },
  {
    id: "leo-carter",
    name: "Leo Carter",
    email: "leo.carter@btic.co",
    team: "hospitality",
    accessRole: "staff",
    staffType: "hospitality-suite",
    status: "active",
    source: "Manual promotion",
    lastUpdate: "Yesterday · 10:44 PM",
  },
  {
    id: "lara-cho",
    name: "Lara Cho",
    email: "lara.cho@btic.co",
    team: "security",
    accessRole: "staff",
    staffType: "security-shift",
    status: "active",
    source: "Master upload · Clean",
    lastUpdate: "Yesterday · 09:20 PM",
  },
  {
    id: "opal-reed",
    name: "Opal Reed",
    email: "opal.reed@btic.co",
    team: "logistics",
    accessRole: "staff",
    staffType: "logistics-fleet",
    status: "active",
    source: "Fleet update import",
    lastUpdate: "Today · 07:38 AM",
  },
  {
    id: "natalie-young",
    name: "Natalie Young",
    email: "natalie.young@btic.co",
    team: "programming",
    accessRole: "attendee",
    status: "invited",
    source: "Self-service RSVP",
    lastUpdate: "Today · 07:05 AM",
  },
  {
    id: "jamie-bowen",
    name: "Jamie Bowen",
    email: "jamie.bowen@btic.co",
    team: "hospitality",
    accessRole: "attendee",
    status: "active",
    source: "Master upload · Clean",
    lastUpdate: "Yesterday · 11:12 PM",
  },
  {
    id: "dahlia-ortiz",
    name: "Dahlia Ortiz",
    email: "dahlia.ortiz@btic.co",
    team: "operations",
    accessRole: "staff",
    staffType: "ops-runner",
    status: "invited",
    source: "Team import · Pending",
    lastUpdate: "Today · 06:54 AM",
  },
  {
    id: "kofi-diaz",
    name: "Kofi Diaz",
    email: "kofi.diaz@btic.co",
    team: "security",
    accessRole: "staff",
    staffType: "security-shift",
    status: "active",
    source: "Manual promotion",
    lastUpdate: "Today · 08:04 AM",
  },
  {
    id: "priya-iyer",
    name: "Priya Iyer",
    email: "priya.iyer@btic.co",
    team: "programming",
    accessRole: "attendee",
    status: "active",
    source: "Master upload · Clean",
    lastUpdate: "Today · 09:00 AM",
  },
  {
    id: "renee-yang",
    name: "Renee Yang",
    email: "renee.yang@btic.co",
    team: "logistics",
    accessRole: "attendee",
    status: "invited",
    source: "Self-service RSVP",
    lastUpdate: "Today · 08:11 AM",
  },
  {
    id: "samir-holt",
    name: "Samir Holt",
    email: "samir.holt@btic.co",
    team: "logistics",
    accessRole: "staff",
    staffType: "logistics-fleet",
    status: "active",
    source: "Master upload · Clean",
    lastUpdate: "Today · 09:20 AM",
  },
  {
    id: "ivy-lam",
    name: "Ivy Lam",
    email: "ivy.lam@btic.co",
    team: "hospitality",
    accessRole: "attendee",
    status: "revoked",
    source: "Manual revoke",
    lastUpdate: "Yesterday · 05:10 PM",
  },
  {
    id: "ethan-brooks",
    name: "Ethan Brooks",
    email: "ethan.brooks@btic.co",
    team: "operations",
    accessRole: "staff",
    staffType: "ops-runner",
    status: "active",
    source: "Master upload · Clean",
    lastUpdate: "Today · 08:58 AM",
  },
  {
    id: "noor-kamal",
    name: "Noor Kamal",
    email: "noor.kamal@btic.co",
    team: "programming",
    accessRole: "attendee",
    status: "active",
    source: "Team import",
    lastUpdate: "Today · 08:01 AM",
  },
] as const;

const statusStyles: Record<PersonStatus, { label: string; badge: string; copy: string }> = {
  active: {
    label: "Active access",
    badge: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40",
    copy: "Person can log in and scan badges right now.",
  },
  invited: {
    label: "Invite pending",
    badge: "bg-amber-500/10 text-amber-300 border border-amber-500/40",
    copy: "Waiting on verification email or staff approval.",
  },
  revoked: {
    label: "Access revoked",
    badge: "bg-rose-500/10 text-rose-300 border border-rose-500/40",
    copy: "Login blocked until access is restored.",
  },
};

const accessStyles: Record<AccessRole, { label: string; badge: string }> = {
  staff: {
    label: "Staff",
    badge: "bg-sky-500/10 text-sky-300 border border-sky-500/40",
  },
  attendee: {
    label: "Attendee",
    badge: "bg-slate-500/10 text-slate-300 border border-slate-500/40",
  },
};

const DEFAULT_TEAM: TeamId = teams[0].id;
const DEFAULT_PERSON = peopleDirectory.find((person) => person.team === DEFAULT_TEAM)?.id ?? peopleDirectory[0].id;
const PAGE_SIZE = 6;

export default function StaffPeoplePage() {
  const [uploadScope, setUploadScope] = useState<UploadScope>("master");
  const [uploadTeam, setUploadTeam] = useState<TeamId>(DEFAULT_TEAM);
  const [uploadPerson, setUploadPerson] = useState<string>(DEFAULT_PERSON);
  const [teamFilter, setTeamFilter] = useState<"all" | TeamId>("all");
  const [accessFilter, setAccessFilter] = useState<"all" | AccessRole>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | PersonStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [gridPage, setGridPage] = useState(0);
  const [exportScope, setExportScope] = useState<ExportScope>("all");
  const [exportTeam, setExportTeam] = useState<TeamId>(DEFAULT_TEAM);
  const [exportPerson, setExportPerson] = useState<string>(DEFAULT_PERSON);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
  const [activePersonId, setActivePersonId] = useState<string | null>(null);
  const [modalRole, setModalRole] = useState<AccessRole>("attendee");
  const [modalStaffType, setModalStaffType] = useState<StaffTypeId>(staffTypes[0].id);

  const rosterTotals = useMemo(() => {
    const staffCount = peopleDirectory.filter((person) => person.accessRole === "staff").length;
    const attendeeCount = peopleDirectory.length - staffCount;
    return { staffCount, attendeeCount };
  }, []);

  const activePerson = useMemo(
    () => peopleDirectory.find((person) => person.id === activePersonId) ?? null,
    [activePersonId]
  );

  useEffect(() => {
    if (activePerson) {
      setModalRole(activePerson.accessRole);
      setModalStaffType(activePerson.staffType ?? staffTypes[0].id);
    }
  }, [activePerson]);

  useEffect(() => {
    const scopedPeople = peopleDirectory.filter((person) => person.team === uploadTeam);
    if (!scopedPeople.some((person) => person.id === uploadPerson)) {
      setUploadPerson(scopedPeople[0]?.id ?? "");
    }
  }, [uploadTeam, uploadPerson]);

  useEffect(() => {
    const scopedPeople = peopleDirectory.filter((person) => person.team === exportTeam);
    if (!scopedPeople.some((person) => person.id === exportPerson)) {
      setExportPerson(scopedPeople[0]?.id ?? "");
    }
  }, [exportTeam, exportPerson]);

  useEffect(() => {
    setGridPage(0);
  }, [teamFilter, accessFilter, statusFilter, searchQuery]);

  const filteredRoster = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return peopleDirectory.filter((person) => {
      if (teamFilter !== "all" && person.team !== teamFilter) {
        return false;
      }
      if (accessFilter !== "all" && person.accessRole !== accessFilter) {
        return false;
      }
      if (statusFilter !== "all" && person.status !== statusFilter) {
        return false;
      }
      if (normalizedSearch.length > 0) {
        const haystack = `${person.name} ${person.email}`.toLowerCase();
        if (!haystack.includes(normalizedSearch)) {
          return false;
        }
      }
      return true;
    });
  }, [teamFilter, accessFilter, statusFilter, searchQuery]);

  useEffect(() => {
    const maxPageIndex = Math.max(0, Math.ceil(filteredRoster.length / PAGE_SIZE) - 1);
    setGridPage((prev) => Math.min(prev, maxPageIndex));
  }, [filteredRoster.length]);

  const pagedRoster = filteredRoster.slice(gridPage * PAGE_SIZE, gridPage * PAGE_SIZE + PAGE_SIZE);
  const pageCount = Math.max(1, Math.ceil(filteredRoster.length / PAGE_SIZE));
  const pageStart = filteredRoster.length === 0 ? 0 : gridPage * PAGE_SIZE + 1;
  const pageEnd = Math.min(filteredRoster.length, (gridPage + 1) * PAGE_SIZE);
  const uploadPersonLabel = peopleDirectory.find((person) => person.id === uploadPerson)?.name ?? "selected contact";
  const exportPersonLabel = peopleDirectory.find((person) => person.id === exportPerson)?.name ?? "selected contact";

  const handleOpenDialog = (personId: string) => {
    setActivePersonId(personId);
    setAccessDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setAccessDialogOpen(open);
    if (!open) {
      setActivePersonId(null);
    }
  };

  return (
    <>
      <main className="min-h-dvh bg-slate-950 text-slate-100">
        <StaffHeader />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
          <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-sky-400">
                  <span>Roster ingest</span>
                  <span className="h-px w-8 bg-slate-800" />
                  <span>Master · Team · Individual</span>
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-white">Import people, emails, and roles</h1>
                  <p className="mt-2 max-w-3xl text-base text-slate-400">
                    Drop CSV/XLSX files that include name, email, team, and access tags. We reuse the same validations
                    across attendees and staff so you can keep one template.
                  </p>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-800/70 bg-slate-950/40 px-6 py-4 text-center text-sm text-slate-400">
                <p className="text-4xl font-semibold text-white">{peopleDirectory.length}</p>
                <p>records mirrored from CSV</p>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Emails + access</p>
              </div>
            </div>
            <div className="mt-6 space-y-5 rounded-2xl border border-slate-800/70 bg-slate-950/50 p-5">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Upload scope</p>
                <Tabs value={uploadScope} onValueChange={(value) => setUploadScope(value as UploadScope)}>
                  <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-slate-900/60 text-white">
                    <TabsTrigger
                      value="master"
                      className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                      Master
                    </TabsTrigger>
                    <TabsTrigger
                      value="team"
                      className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                      Team
                    </TabsTrigger>
                    <TabsTrigger
                      value="person"
                      className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                      Individual
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              {uploadScope !== "master" && (
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Team</Label>
                  <Select value={uploadTeam} onValueChange={(value) => setUploadTeam(value as TeamId)}>
                    <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                      <SelectValue placeholder="Choose team" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {uploadScope === "person" && (
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Individual</Label>
                  <Select value={uploadPerson} onValueChange={setUploadPerson}>
                    <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                      <SelectValue placeholder="Select person" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                      {peopleDirectory
                        .filter((person) => person.team === uploadTeam)
                        .map((person) => (
                          <SelectItem key={person.id} value={person.id}>
                            {person.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <label
                htmlFor="people-upload"
                className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 p-6 text-center transition hover:border-sky-500/60">
                <UploadCloud className="h-8 w-8 text-sky-300" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {uploadScope === "master"
                      ? "Drop global roster CSV"
                      : uploadScope === "team"
                      ? `Upload ${teamLookup[uploadTeam]} contacts`
                      : `Upload roster entry for ${uploadPersonLabel}`}
                  </p>
                  <p className="text-xs text-slate-500">Required columns: name, email, team, access_role, staff_type</p>
                </div>
                <input id="people-upload" type="file" className="hidden" accept=".csv,.xlsx" />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  variant="outline"
                  className="rounded-2xl border-slate-700 bg-slate-950/40 text-sm font-semibold text-slate-100 hover:border-sky-500/60">
                  Run validations
                </Button>
                <Button className="rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400">
                  Stage upload
                </Button>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-sky-400">
                  <span>Directory intelligence</span>
                  <span className="h-px w-8 bg-slate-800" />
                  <span>Live roster grid</span>
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white">People · Emails · Access guardrails</h2>
                  <p className="mt-2 max-w-3xl text-base text-slate-400">
                    Filter by team, role, or status, then open any row to promote them to staff, change their staff
                    type, or fully revoke access with audit-ready notes.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 px-5 py-3 text-center">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Staffers</p>
                  <p className="text-2xl font-semibold text-white">{rosterTotals.staffCount}</p>
                </div>
                <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 px-5 py-3 text-center">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Attendees</p>
                  <p className="text-2xl font-semibold text-white">{rosterTotals.attendeeCount}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-[28px] border border-slate-800/80 bg-slate-950/50 p-4">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-slate-500">
                <span>Mirrors roster_template.csv</span>
                <span>Inline access actions</span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-800/70 bg-slate-950/30 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
                  <Filter className="h-4 w-4 text-sky-300" />
                  <span>{filteredRoster.length} people</span>
                </div>
                <Select value={teamFilter} onValueChange={(value) => setTeamFilter(value as "all" | TeamId)}>
                  <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
                    <SelectValue placeholder="Team filter" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                    <SelectItem value="all">All teams</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={accessFilter} onValueChange={(value) => setAccessFilter(value as "all" | AccessRole)}>
                  <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
                    <SelectValue placeholder="Access filter" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                    <SelectItem value="all">Staff + Attendees</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="attendee">Attendees</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "all" | PersonStatus)}>
                  <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
                    <SelectValue placeholder="Status filter" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="invited">Invited</SelectItem>
                    <SelectItem value="revoked">Revoked</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search name or email"
                  className="w-full rounded-2xl border-slate-700 bg-slate-950/30 text-slate-100 placeholder:text-slate-500 sm:w-64"
                />
              </div>
              <div className="mt-4">
                {pagedRoster.length > 0 ? (
                  <Table className="text-sm text-slate-200 border-collapse [&_td]:align-top">
                    <TableHeader>
                      <TableRow className="bg-slate-900/70 text-xs uppercase tracking-[0.25em] text-slate-500">
                        <TableHead className="min-w-[240px] border border-slate-800/60 bg-slate-950/60 text-slate-400">
                          Person · Email
                        </TableHead>
                        <TableHead className="border border-slate-800/60 text-slate-400">Team · Role</TableHead>
                        <TableHead className="border border-slate-800/60 text-slate-400">Access</TableHead>
                        <TableHead className="border border-slate-800/60 text-slate-400">Status · Source</TableHead>
                        <TableHead className="border border-slate-800/60 text-right text-slate-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pagedRoster.map((person) => {
                        const statusStyle = statusStyles[person.status];
                        const accessStyle = accessStyles[person.accessRole];
                        return (
                          <TableRow key={person.id} className="border border-slate-800/60">
                            <TableCell className="border border-slate-800/60 bg-slate-950/40 p-3">
                              <p className="font-semibold text-white">{person.name}</p>
                              <p className="text-xs text-slate-500">{person.email}</p>
                            </TableCell>
                            <TableCell className="border border-slate-800/60 p-3">
                              <p className="text-sm font-medium text-white">{teamLookup[person.team]}</p>
                              {person.accessRole === "staff" && person.staffType && (
                                <p className="text-xs text-slate-500">{staffTypeLookup[person.staffType]}</p>
                              )}
                              {person.accessRole === "attendee" && (
                                <p className="text-xs text-slate-500">Attendee · No staff type</p>
                              )}
                            </TableCell>
                            <TableCell className="border border-slate-800/60 p-3">
                              <div className="flex flex-wrap gap-2">
                                <Badge className={`rounded-full px-3 py-1 text-[0.65rem] ${accessStyle.badge}`}>
                                  {accessStyle.label}
                                </Badge>
                                {person.accessRole === "staff" && person.staffType && (
                                  <Badge className="rounded-full border border-slate-700 bg-slate-950/60 text-[0.65rem] text-slate-200">
                                    {staffTypeLookup[person.staffType]}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="border border-slate-800/60 p-3">
                              <div className="space-y-1">
                                <Badge className={`rounded-full px-3 py-1 text-[0.65rem] ${statusStyle.badge}`}>
                                  {statusStyle.label}
                                </Badge>
                                <p className="text-xs text-slate-400">{person.source}</p>
                                <p className="text-[0.65rem] uppercase tracking-[0.25em] text-slate-500">
                                  {person.lastUpdate}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="border border-slate-800/60 p-3 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-slate-700 bg-slate-950/50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100 hover:border-sky-500/60"
                                onClick={() => handleOpenDialog(person.id)}>
                                Manage
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-6 text-center text-sm text-slate-400">
                    No people match the applied filters.
                  </div>
                )}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                  <p>
                    {filteredRoster.length === 0
                      ? "No people to display."
                      : `Showing ${pageStart}–${pageEnd} of ${filteredRoster.length} people`}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={gridPage === 0}
                      className="rounded-xl border-slate-700 bg-slate-950/50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100 disabled:opacity-30"
                      onClick={() => setGridPage((prev) => Math.max(0, prev - 1))}>
                      Previous
                    </Button>
                    <span className="text-sm text-slate-300">
                      Page {filteredRoster.length === 0 ? 0 : gridPage + 1} /{" "}
                      {filteredRoster.length === 0 ? 0 : pageCount}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={gridPage >= pageCount - 1 || filteredRoster.length === 0}
                      className="rounded-xl border-slate-700 bg-slate-950/50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100 disabled:opacity-30"
                      onClick={() => setGridPage((prev) => Math.min(pageCount - 1, prev + 1))}>
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-slate-800 bg-slate-900/60 p-6 shadow-[0px_30px_60px_rgba(2,6,23,0.45)] lg:p-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
                  <span>Roster exports</span>
                  <span className="h-px w-8 bg-slate-800" />
                  <span>CSV · XLSX</span>
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-white">Shareable snapshots for compliance + ops</h2>
                <p className="text-slate-400">
                  Mirror whatever filters you need—everyone, a specific team, or just one staffer—for downstream audits
                  or contract uploaders.
                </p>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-slate-300">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Most recent export</p>
                  <p className="font-semibold text-white">2 mins ago · CSV · All staff</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Generated by</p>
                  <p className="font-semibold text-white">Jordan King</p>
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                <Tabs value={exportScope} onValueChange={(value) => setExportScope(value as ExportScope)}>
                  <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-slate-900/60">
                    <TabsTrigger value="all" className="rounded-xl text-xs uppercase tracking-[0.2em]">
                      Everyone
                    </TabsTrigger>
                    <TabsTrigger value="team" className="rounded-xl text-xs uppercase tracking-[0.2em]">
                      Team
                    </TabsTrigger>
                    <TabsTrigger value="person" className="rounded-xl text-xs uppercase tracking-[0.2em]">
                      Individual
                    </TabsTrigger>
                  </TabsList>
                  <div className="mt-6 space-y-4">
                    <TabsContent value="all">
                      <p className="text-sm text-slate-300">
                        Includes every attendee and staff record with current access + roles.
                      </p>
                    </TabsContent>
                    <TabsContent value="team" className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Team</Label>
                        <Select value={exportTeam} onValueChange={(value) => setExportTeam(value as TeamId)}>
                          <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                            <SelectValue placeholder="Choose team" />
                          </SelectTrigger>
                          <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                            {teams.map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-xs text-slate-500">Limited to roster rows tied to {teamLookup[exportTeam]}.</p>
                    </TabsContent>
                    <TabsContent value="person" className="space-y-3">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Team</Label>
                          <Select value={exportTeam} onValueChange={(value) => setExportTeam(value as TeamId)}>
                            <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                              <SelectValue placeholder="Team" />
                            </SelectTrigger>
                            <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                              {teams.map((team) => (
                                <SelectItem key={team.id} value={team.id}>
                                  {team.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Person</Label>
                          <Select value={exportPerson} onValueChange={setExportPerson}>
                            <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                              <SelectValue placeholder="Person" />
                            </SelectTrigger>
                            <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                              {peopleDirectory
                                .filter((person) => person.team === exportTeam)
                                .map((person) => (
                                  <SelectItem key={person.id} value={person.id}>
                                    {person.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">Targets {exportPersonLabel} with their latest metadata.</p>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
              <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Format</Label>
                  <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as ExportFormat)}>
                    <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                      <SelectValue placeholder="Choose format" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                      <SelectItem value="csv">CSV (spreadsheet ready)</SelectItem>
                      <SelectItem value="xlsx">Excel spreadsheet (.xlsx)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400">
                  Generate {exportFormat === "csv" ? "CSV roster" : "XLSX roster"}
                </Button>
              </div>
            </div>
          </section>
        </div>
        <StaffFooter />
      </main>

      <Dialog open={accessDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="border-slate-800 bg-slate-950 text-slate-100">
          {activePerson ? (
            <>
              <DialogHeader className="gap-3">
                <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">
                  <Users2 className="h-4 w-4 text-sky-300" />
                  <span>Access control</span>
                </div>
                <DialogTitle className="text-2xl text-white">{activePerson.name}</DialogTitle>
                <DialogDescription className="text-slate-400">{activePerson.email}</DialogDescription>
              </DialogHeader>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Role type</Label>
                  <Tabs value={modalRole} onValueChange={(value) => setModalRole(value as AccessRole)}>
                    <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-slate-900/60">
                      <TabsTrigger
                        value="staff"
                        className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                        Staff
                      </TabsTrigger>
                      <TabsTrigger
                        value="attendee"
                        className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                        Attendee
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                {modalRole === "staff" && (
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Staff type</Label>
                    <Select value={modalStaffType} onValueChange={(value) => setModalStaffType(value as StaffTypeId)}>
                      <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                        <SelectValue placeholder="Select staff type" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                        {staffTypes.map((staffType) => (
                          <SelectItem key={staffType.id} value={staffType.id}>
                            {staffType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4">
                  <p className="text-sm font-semibold text-white">Current status</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge
                      className={`rounded-full px-3 py-1 text-[0.65rem] ${statusStyles[activePerson.status].badge}`}>
                      {statusStyles[activePerson.status].label}
                    </Badge>
                    <Badge
                      className={`rounded-full px-3 py-1 text-[0.65rem] ${
                        accessStyles[activePerson.accessRole].badge
                      }`}>
                      {accessStyles[activePerson.accessRole].label}
                    </Badge>
                  </div>
                  <p className="mt-3 text-xs text-slate-400">{statusStyles[activePerson.status].copy}</p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl border-rose-500/50 bg-rose-500/10 text-sm font-semibold text-rose-200 hover:border-rose-400 hover:bg-rose-500/20">
                  <ShieldBan className="mr-2 h-4 w-4" />
                  Revoke access
                </Button>
                <Button className="flex-1 rounded-xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400">
                  <UserMinus2 className="mr-2 h-4 w-4" />
                  Apply updates
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="space-y-4 text-center">
              <Users2 className="mx-auto h-10 w-10 text-slate-500" />
              <p className="text-sm text-slate-400">Select a person from the roster to manage their access.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
