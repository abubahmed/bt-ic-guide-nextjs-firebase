"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Filter, History, Trash2, UploadCloud } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import StaffFooter from "../(dashboard)/components/footer";
import StaffHeader from "../(dashboard)/components/header";

const teams = [
  { id: "operations", label: "Operations" },
  { id: "programming", label: "Programming" },
  { id: "hospitality", label: "Hospitality" },
  { id: "security", label: "Security" },
  { id: "logistics", label: "Logistics" },
] as const;

const teamLookup = teams.reduce<Record<string, string>>((acc, team) => {
  acc[team.id] = team.label;
  return acc;
}, {});

const staff = [
  { id: "alex-chen", name: "Alex Chen", team: "operations", role: "Ops hub lead" },
  { id: "brianna-lee", name: "Brianna Lee", team: "operations", role: "Site logistics" },
  { id: "carter-simmons", name: "Carter Simmons", team: "operations", role: "Stage direction" },
  { id: "maya-patel", name: "Maya Patel", team: "programming", role: "Panel wrangler" },
  { id: "noor-kamal", name: "Noor Kamal", team: "programming", role: "Speaker concierge" },
  { id: "owen-blake", name: "Owen Blake", team: "programming", role: "Content editor" },
  { id: "leo-carter", name: "Leo Carter", team: "hospitality", role: "VIP liaison" },
  { id: "sara-ng", name: "Sara Ng", team: "hospitality", role: "Suite management" },
  { id: "tariq-farouq", name: "Tariq Farouq", team: "hospitality", role: "Guest transport" },
  { id: "ivy-lam", name: "Ivy Lam", team: "hospitality", role: "Culinary liaison" },
  { id: "diana-park", name: "Diana Park", team: "security", role: "Access control" },
  { id: "lara-cho", name: "Lara Cho", team: "security", role: "Badge command" },
  { id: "miles-porter", name: "Miles Porter", team: "security", role: "Escort detail" },
  { id: "nina-vasquez", name: "Nina Vasquez", team: "security", role: "Night shift lead" },
  { id: "luca-ramirez", name: "Luca Ramirez", team: "logistics", role: "Transport chief" },
] as const;

const roomTemplates = [
  { room: "1201", floor: "12", type: "Executive suite" },
  { room: "1203", floor: "12", type: "Executive suite" },
  { room: "901", floor: "9", type: "Corner king" },
  { room: "903", floor: "9", type: "Corner king" },
  { room: "905", floor: "9", type: "Corner king" },
  { room: "702", floor: "7", type: "Double queen" },
  { room: "704", floor: "7", type: "Double queen" },
  { room: "706", floor: "7", type: "Double queen" },
  { room: "502", floor: "5", type: "Standard king" },
  { room: "504", floor: "5", type: "Standard king" },
] as const;

const roomAssignments = staff.reduce<Record<string, { room: string; floor: string; type: string; note: string }>>(
  (acc, person, index) => {
    const template = roomTemplates[index % roomTemplates.length];
    acc[person.id] = {
      room: template.room,
      floor: template.floor,
      type: template.type,
      note: index % 3 === 0 ? "Near elevators" : index % 3 === 1 ? "Quiet wing" : "Adjacent to team lead",
    };
    return acc;
  },
  {},
);

const changeLog = [
  {
    id: "room-evt-1",
    intent: "upload",
    actor: "Quincy Hale",
    action: "Uploaded master room roster",
    detail: "rooms_master.csv · 96 rows",
    timestamp: "Today · 08:12",
  },
  {
    id: "room-evt-2",
    intent: "edit",
    actor: "Lara Cho",
    action: "Reassigned badge team cluster",
    detail: "Moved four staffers to level 9 corner suites",
    timestamp: "Today · 07:48",
  },
  {
    id: "room-evt-3",
    intent: "delete",
    actor: "Sara Ng",
    action: "Removed duplicate VIP listing",
    detail: "Room 1203 released for host committee",
    timestamp: "Yesterday · 23:22",
  },
] as const;

const intentStyles: Record<
  (typeof changeLog)[number]["intent"],
  { badge: string; icon: JSX.Element; accent: string }
> = {
  upload: {
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
    icon: <UploadCloud className="h-4 w-4" />,
    accent: "from-emerald-500/20 via-transparent to-transparent",
  },
  edit: {
    badge: "bg-sky-500/10 text-sky-300 border-sky-500/40",
    icon: <History className="h-4 w-4" />,
    accent: "from-sky-500/20 via-transparent to-transparent",
  },
  delete: {
    badge: "bg-rose-500/10 text-rose-300 border-rose-500/40",
    icon: <Trash2 className="h-4 w-4" />,
    accent: "from-rose-500/20 via-transparent to-transparent",
  },
};

const PAGE_SIZE = 10;

type UploadScope = "master" | "team" | "person";
type ExportScope = "all" | "team" | "person";
type ExportFormat = "csv" | "xlsx";

export default function StaffRoomsPage() {
  const [uploadScope, setUploadScope] = useState<UploadScope>("master");
  const [uploadTeam, setUploadTeam] = useState(teams[0].id);
  const [uploadPerson, setUploadPerson] = useState(staff.find((p) => p.team === teams[0].id)?.id ?? "");
  const [filterTeam, setFilterTeam] = useState<string>("all");
  const [filterPerson, setFilterPerson] = useState<string>("all");
  const [gridPage, setGridPage] = useState(0);
  const [exportScope, setExportScope] = useState<ExportScope>("all");
  const [exportTeam, setExportTeam] = useState(teams[0].id);
  const [exportPerson, setExportPerson] = useState(staff.find((p) => p.team === teams[0].id)?.id ?? "");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");

  useEffect(() => {
    const candidates = staff.filter((person) => person.team === uploadTeam);
    if (!candidates.some((person) => person.id === uploadPerson)) {
      setUploadPerson(candidates[0]?.id ?? "");
    }
  }, [uploadTeam, uploadPerson]);

  useEffect(() => {
    const candidates = staff.filter((person) => person.team === exportTeam);
    if (!candidates.some((person) => person.id === exportPerson)) {
      setExportPerson(candidates[0]?.id ?? "");
    }
  }, [exportTeam, exportPerson]);

  const filteredPeople = useMemo(() => {
    if (filterTeam === "all") {
      return staff;
    }
    return staff.filter((person) => person.team === filterTeam);
  }, [filterTeam]);

  const visiblePeople = useMemo(() => {
    if (filterPerson === "all") {
      return filteredPeople;
    }
    return filteredPeople.filter((person) => person.id === filterPerson);
  }, [filteredPeople, filterPerson]);

  useEffect(() => {
    setGridPage(0);
  }, [filterTeam, filterPerson]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(visiblePeople.length / PAGE_SIZE) - 1);
    setGridPage((prev) => Math.min(prev, maxPage));
  }, [visiblePeople.length]);

  const pagedPeople = visiblePeople.slice(gridPage * PAGE_SIZE, gridPage * PAGE_SIZE + PAGE_SIZE);
  const pageCount = Math.max(1, Math.ceil(visiblePeople.length / PAGE_SIZE));
  const pageStart = visiblePeople.length === 0 ? 0 : gridPage * PAGE_SIZE + 1;
  const pageEnd = Math.min(visiblePeople.length, (gridPage + 1) * PAGE_SIZE);

  return (
    <main className="min-h-dvh bg-slate-950 text-slate-100">
      <StaffHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
        <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-8 shadow-[0px_30px_80px_rgba(2,6,23,0.45)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-sky-400">
                <span>BTIC Staff Ops</span>
                <span className="h-px w-8 bg-slate-800" />
                <span>Room inventory</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-3 text-sky-200">
                  <Building2 className="h-6 w-6" />
                </span>
                <div>
                  <h1 className="text-3xl font-semibold text-white">Rooms & access workspace</h1>
                  <p className="text-sm text-slate-400">
                    Mirroring the schedules console—now focused on room assignments, uploads, exports, and audit trails.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/40 px-6 py-4 text-center text-sm text-slate-400">
              <p className="text-4xl font-semibold text-white">{staff.length}</p>
              <p>active staffers</p>
              <p className="text-xs text-slate-500">Auto-synced to nightly roster drop</p>
            </div>
          </div>
          <div className="mt-6 rounded-[28px] border border-slate-800/80 bg-slate-950/50 p-4">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-slate-500">
              <span>Compact grid</span>
              <span>Aligned to CSV template</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-800/70 bg-slate-950/30 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
                <Filter className="h-4 w-4 text-sky-300" />
                <span>
                  {visiblePeople.length} staff · {roomTemplates.length} reference rooms
                </span>
              </div>
              <Select value={filterTeam} onValueChange={setFilterTeam}>
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
              <Select value={filterPerson} onValueChange={setFilterPerson}>
                <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-56">
                  <SelectValue placeholder="Individual filter" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                  <SelectItem value="all">All staffers</SelectItem>
                  {filteredPeople.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4">
              {pagedPeople.length > 0 ? (
                <Table className="text-sm text-slate-200 border-collapse [&_td]:align-top">
                  <TableHeader>
                    <TableRow className="bg-slate-900/70 text-xs uppercase tracking-[0.25em] text-slate-500">
                      <TableHead className="min-w-[220px] border border-slate-800/60 bg-slate-950/60 text-slate-400">
                        Staffer · Team
                      </TableHead>
                      <TableHead className="border border-slate-800/60 text-slate-400">Room</TableHead>
                      <TableHead className="border border-slate-800/60 text-slate-400 text-center">Floor</TableHead>
                      <TableHead className="border border-slate-800/60 text-slate-400">Type</TableHead>
                      <TableHead className="border border-slate-800/60 text-slate-400">Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedPeople.map((person) => {
                      const slot = roomAssignments[person.id];
                      return (
                        <TableRow key={person.id} className="border border-slate-800/60">
                          <TableCell className="border border-slate-800/60 bg-slate-950/40 p-3">
                            <p className="font-semibold text-white">{person.name}</p>
                            <p className="text-xs text-slate-500">
                              {teamLookup[person.team]} • {person.role}
                            </p>
                          </TableCell>
                          <TableCell className="border border-slate-800/60 p-3 font-mono text-base tracking-wide text-slate-100">
                            {slot.room}
                          </TableCell>
                          <TableCell className="border border-slate-800/60 p-3 text-center text-slate-200">{slot.floor}</TableCell>
                          <TableCell className="border border-slate-800/60 p-3 text-slate-300">{slot.type}</TableCell>
                          <TableCell className="border border-slate-800/60 p-3 text-slate-400">{slot.note}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6 text-center text-sm text-slate-400">
                  No room assignments match the applied filters.
                </div>
              )}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <p>
                  {visiblePeople.length === 0
                    ? "No staffers to display."
                    : `Showing ${pageStart}–${pageEnd} of ${visiblePeople.length} staffers`}
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
                    Page {visiblePeople.length === 0 ? 0 : gridPage + 1} / {visiblePeople.length === 0 ? 0 : pageCount}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={gridPage >= pageCount - 1 || visiblePeople.length === 0}
                    className="rounded-xl border-slate-700 bg-slate-950/50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100 disabled:opacity-30"
                    onClick={() => setGridPage((prev) => Math.min(pageCount - 1, prev + 1))}>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.35)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">Spreadsheet staging</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Upload master, team, or individual rooms</h2>
              <p className="text-sm text-slate-400">Drop in the CSV template you trust—we will mirror it back here instantly.</p>
            </div>
            <Tabs value={uploadScope} onValueChange={(value) => setUploadScope(value as UploadScope)} className="self-start">
              <TabsList className="rounded-full border border-slate-800 bg-slate-950/50">
                <TabsTrigger value="master" className="rounded-full px-4 py-1 text-xs uppercase tracking-[0.3em]">
                  Master
                </TabsTrigger>
                <TabsTrigger value="team" className="rounded-full px-4 py-1 text-xs uppercase tracking-[0.3em]">
                  Team
                </TabsTrigger>
                <TabsTrigger value="person" className="rounded-full px-4 py-1 text-xs uppercase tracking-[0.3em]">
                  Individual
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {uploadScope !== "master" && (
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Team scope</Label>
                <Select value={uploadTeam} onValueChange={setUploadTeam}>
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
                    <SelectValue placeholder="Choose staffer" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                    {staff
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
          </div>
          <div className="mt-4 rounded-3xl border border-dashed border-slate-800 bg-slate-950/30 p-6 text-center text-slate-400">
            <Label htmlFor="rooms-upload" className="cursor-pointer text-base text-white">
              Drag & drop CSV or click to browse
            </Label>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">rooms_template.csv</p>
            <input id="rooms-upload" type="file" className="hidden" />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">Accepted formats: CSV, XLSX · We validate columns before staging.</p>
            <Button className="rounded-2xl bg-emerald-500/90 text-slate-950 hover:bg-emerald-400" size="lg">
              Stage upload
            </Button>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-[0px_30px_60px_rgba(2,6,23,0.35)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-sky-400">Export schedules</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Export structured room assignments</h2>
              <p className="text-sm text-slate-400">Select the scope, pick a format, and ship it to your downstream systems.</p>
            </div>
            <Tabs value={exportScope} onValueChange={(value) => setExportScope(value as ExportScope)} className="self-start">
              <TabsList className="rounded-full border border-slate-800 bg-slate-950/50">
                <TabsTrigger value="all" className="rounded-full px-4 py-1 text-xs uppercase tracking-[0.3em]">
                  All staff
                </TabsTrigger>
                <TabsTrigger value="team" className="rounded-full px-4 py-1 text-xs uppercase tracking-[0.3em]">
                  Team
                </TabsTrigger>
                <TabsTrigger value="person" className="rounded-full px-4 py-1 text-xs uppercase tracking-[0.3em]">
                  Individual
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {exportScope !== "all" && (
              <div className="lg:col-span-1">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Team scope</Label>
                <Select value={exportTeam} onValueChange={setExportTeam}>
                  <SelectTrigger className="mt-2 rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
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
            {exportScope === "person" && (
              <div className="lg:col-span-1">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Individual</Label>
                <Select value={exportPerson} onValueChange={setExportPerson}>
                  <SelectTrigger className="mt-2 rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                    <SelectValue placeholder="Choose staffer" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                    {staff
                      .filter((person) => person.team === exportTeam)
                      .map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="lg:col-span-1">
              <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Format</Label>
              <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as ExportFormat)}>
                <SelectTrigger className="mt-2 rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                  <SelectValue placeholder="Choose format" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">Exports include audit metadata and timestamps by default.</p>
            <Button className="rounded-2xl bg-sky-500/90 text-slate-950 hover:bg-sky-400" size="lg">
              Generate export
            </Button>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-[0px_30px_60px_rgba(2,6,23,0.3)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Change log</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Audit every room update</h2>
            </div>
            <Button variant="outline" className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100" size="sm">
              View all entries
            </Button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {changeLog.map((entry) => {
              const styles = intentStyles[entry.intent];
              return (
                <div key={entry.id} className="rounded-3xl border border-slate-800/70 bg-slate-950/50 p-4">
                  <div className="flex items-center gap-2">
                    <Badge className={`${styles.badge} border text-[0.65rem] uppercase tracking-[0.35em]`}>
                      {entry.intent}
                    </Badge>
                    <span className="text-xs text-slate-500">{entry.timestamp}</span>
                  </div>
                  <div className={`mt-4 rounded-2xl border border-slate-800/60 bg-gradient-to-br ${styles.accent} p-4`}>
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      {styles.icon}
                      <span>{entry.action}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{entry.detail}</p>
                    <p className="mt-1 text-xs text-slate-500">By {entry.actor}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <StaffFooter />
    </main>
  );
}
