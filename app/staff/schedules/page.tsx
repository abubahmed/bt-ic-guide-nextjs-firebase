"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Edit3, Filter, History, Trash2, UploadCloud } from "lucide-react";
 
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 
import StaffFooter from "../(dashboard)/components/footer";
import StaffHeader from "../(dashboard)/components/header";
 
 const teams = [
   { id: "operations", label: "Operations" },
   { id: "programming", label: "Programming" },
   { id: "hospitality", label: "Hospitality" },
   { id: "security", label: "Security" },
   { id: "logistics", label: "Logistics" },
 ];
 
const teamLookup = teams.reduce<Record<string, string>>((acc, team) => {
  acc[team.id] = team.label;
  return acc;
}, {});

const people = [
  { id: "alex-chen", label: "Alex Chen", team: "operations", role: "Ops hub lead" },
  { id: "maya-patel", label: "Maya Patel", team: "programming", role: "Panel wrangler" },
  { id: "leo-carter", label: "Leo Carter", team: "hospitality", role: "VIP liaison" },
  { id: "diana-park", label: "Diana Park", team: "security", role: "Access control" },
  { id: "luca-ramirez", label: "Luca Ramirez", team: "logistics", role: "Transport chief" },
];
 
type GridSlot = {
  title: string;
  time: string;
  location: string;
  source: "upload" | "manual" | "hold";
};

const gridDays = [
  { id: "day0", label: "Wed · Day 0" },
  { id: "day1", label: "Thu · Day 1" },
  { id: "day2", label: "Fri · Day 2" },
  { id: "day3", label: "Sat · Day 3" },
  { id: "day4", label: "Sun · Day 4" },
] as const;

type DayKey = (typeof gridDays)[number]["id"];
type UploadScope = "master" | "team" | "person";
type DownloadScope = "all" | "team" | "person";
type DayScope = "all" | DayKey;
type DownloadFormat = "csv" | "xlsx";

const timeBlocks = [
  { title: "Morning coverage", time: "07:30 – 09:30" },
  { title: "Midday activation", time: "10:00 – 13:00" },
  { title: "Afternoon reset", time: "14:00 – 17:00" },
] as const;

const locationAnchors = ["Command deck", "Main ballroom", "Ops loft"] as const;
const sourceCycle: GridSlot["source"][] = ["upload", "manual", "hold"];

const gridAssignments: Record<string, Record<DayKey, GridSlot[]>> = people.reduce(
  (acc, person) => {
    const personAssignments = gridDays.reduce((dayAcc, day, dayIndex) => {
      dayAcc[day.id] = timeBlocks.map((block, blockIndex) => ({
        title: `${block.title} ${dayIndex + 1}`,
        time: block.time,
        location: `${day.label.split("·")[0].trim()} · ${locationAnchors[blockIndex]}`,
        source: sourceCycle[(blockIndex + dayIndex) % sourceCycle.length],
      }));
      return dayAcc;
    }, {} as Record<DayKey, GridSlot[]>);

    acc[person.id] = personAssignments;
    return acc;
  },
  {} as Record<string, Record<DayKey, GridSlot[]>>,
);
 
 const historyEntries = [
   {
     id: "evt-1",
     actor: "Jordan King",
     action: "Uploaded master schedule",
     detail: "BTIC_master.csv · 148 rows · validation clean",
     timestamp: "Today · 09:18 AM",
     intent: "upload",
   },
   {
     id: "evt-2",
     actor: "Maya Patel",
     action: "Edited Operations shift blocks",
     detail: "Moved AV coverage to 14:30, reassigned two floaters",
     timestamp: "Today · 07:45 AM",
     intent: "edit",
   },
   {
     id: "evt-3",
     actor: "Kofi Diaz",
     action: "Deleted outdated badge control slot",
     detail: "Removed 23:00–00:00 slot for Alex Chen",
     timestamp: "Today · 07:12 AM",
     intent: "delete",
   },
   {
     id: "evt-4",
     actor: "Cal Rivers",
     action: "Uploaded Programming AM rotations",
     detail: "programming_day2.xlsx · 36 rows",
     timestamp: "Yesterday · 10:24 PM",
     intent: "upload",
   },
 ];
 
const intentStyles: Record<string, { badge: string; icon: JSX.Element; accent: string }> = {
  upload: {
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
    icon: <UploadCloud className="h-4 w-4 text-emerald-300" />,
    accent: "from-emerald-500/20 via-transparent to-transparent",
  },
   edit: {
     badge: "bg-sky-500/10 text-sky-300 border-sky-500/40",
     icon: <Edit3 className="h-4 w-4 text-sky-300" />,
     accent: "from-sky-500/20 via-transparent to-transparent",
   },
   delete: {
     badge: "bg-rose-500/10 text-rose-300 border-rose-500/40",
     icon: <Trash2 className="h-4 w-4 text-rose-300" />,
     accent: "from-rose-500/20 via-transparent to-transparent",
   },
 };
 
export default function StaffSchedulesPage() {
  const [uploadScope, setUploadScope] = useState<UploadScope>("master");
  const [uploadTeam, setUploadTeam] = useState(teams[0]?.id ?? "");
  const [uploadPerson, setUploadPerson] = useState(
    people.find((person) => person.team === (teams[0]?.id ?? ""))?.id ?? "",
  );
  const [downloadScope, setDownloadScope] = useState<DownloadScope>("all");
  const [downloadTeam, setDownloadTeam] = useState(teams[0]?.id ?? "");
  const [downloadPerson, setDownloadPerson] = useState(
    people.find((person) => person.team === (teams[0]?.id ?? ""))?.id ?? "",
  );
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>("csv");
  const [downloadDay, setDownloadDay] = useState<DayScope>("all");
  const [gridTeamFilter, setGridTeamFilter] = useState<string>("all");
  const [gridPersonFilter, setGridPersonFilter] = useState<string>("all");
  const [gridDayFilter, setGridDayFilter] = useState<DayScope>("all");

  useEffect(() => {
    const fallbackTeam = uploadTeam || teams[0]?.id || "";
    const teamPeople = people.filter((person) => person.team === fallbackTeam);
    if (!teamPeople.some((person) => person.id === uploadPerson)) {
      setUploadPerson(teamPeople[0]?.id ?? "");
    }
  }, [uploadTeam, uploadPerson]);

  useEffect(() => {
    const fallbackTeam = downloadTeam || teams[0]?.id || "";
    const teamPeople = people.filter((person) => person.team === fallbackTeam);
    if (!teamPeople.some((person) => person.id === downloadPerson)) {
      setDownloadPerson(teamPeople[0]?.id ?? "");
    }
  }, [downloadTeam, downloadPerson]);

  useEffect(() => {
    if (gridPersonFilter === "all") {
      return;
    }
    const person = people.find((candidate) => candidate.id === gridPersonFilter);
    if (!person || (gridTeamFilter !== "all" && person.team !== gridTeamFilter)) {
      setGridPersonFilter("all");
    }
  }, [gridTeamFilter, gridPersonFilter]);

  const peopleByTeam = useMemo(() => {
    if (gridTeamFilter === "all") {
      return people;
    }
    return people.filter((person) => person.team === gridTeamFilter);
  }, [gridTeamFilter]);

  const visiblePeople = useMemo(() => {
    if (gridPersonFilter === "all") {
      return peopleByTeam;
    }
    return peopleByTeam.filter((person) => person.id === gridPersonFilter);
  }, [peopleByTeam, gridPersonFilter]);

  const visibleDays = gridDayFilter === "all" ? gridDays : gridDays.filter((day) => day.id === gridDayFilter);
  const latestUploads = historyEntries.filter((entry) => entry.intent === "upload").slice(0, 3);
  const downloadDayLabel =
    downloadDay === "all" ? "All days" : gridDays.find((day) => day.id === downloadDay)?.label ?? "Selected day";
 
   return (
     <main className="min-h-dvh bg-slate-950 text-slate-100">
       <StaffHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
        <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-sky-400">
                <span>BTIC Staff Ops</span>
                <span className="h-px w-8 bg-slate-800" />
                <span>Inline schedule grid</span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-white">Live CSV-style workspace</h1>
                <p className="mt-2 max-w-3xl text-base text-slate-400">
                  Review every team and day at a glance, then click into a cell to edit, swap locations, or delete shifts before
                  pushing updates to the master spreadsheet.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400">
                <Download className="mr-2 h-4 w-4" />
                Upload kit
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl border-slate-700 bg-slate-950/60 text-sm font-semibold text-slate-100 hover:border-sky-500/60">
                <History className="mr-2 h-4 w-4" />
                Audit trail
              </Button>
            </div>
          </div>
          <div className="mt-6 rounded-[28px] border border-slate-800/80 bg-slate-950/50 p-4">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-slate-500">
              <span>Grid mirrors the CSV template</span>
              <span>Tip: double-click any cell to edit inline</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-800/70 bg-slate-950/30 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
                <Filter className="h-4 w-4 text-sky-300" />
                <span>
                  {visiblePeople.length} staff · {visibleDays.length * timeBlocks.length} blocks
                </span>
              </div>
              <Select value={gridTeamFilter} onValueChange={setGridTeamFilter}>
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
              <Select value={gridPersonFilter} onValueChange={setGridPersonFilter}>
                <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-56">
                  <SelectValue placeholder="Individual filter" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                  <SelectItem value="all">All staffers</SelectItem>
                  {peopleByTeam.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={gridDayFilter} onValueChange={(value) => setGridDayFilter(value as DayScope)}>
                <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
                  <SelectValue placeholder="Day filter" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                  <SelectItem value="all">All days</SelectItem>
                  {gridDays.map((day) => (
                    <SelectItem key={day.id} value={day.id}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4">
              <Table className="text-sm text-slate-200 border-collapse [&_td]:align-top">
                <TableHeader>
                  <TableRow className="bg-slate-900/70 text-xs uppercase tracking-[0.25em] text-slate-500">
                    <TableHead className="min-w-[200px] border border-slate-800/60 bg-slate-950/60 text-slate-400">
                      Staffer · Team
                    </TableHead>
                    {visibleDays.map((day) => (
                      <TableHead key={day.id} className="border border-slate-800/60 bg-slate-950/60 text-center text-slate-400">
                        {day.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visiblePeople.map((person) => (
                    <TableRow key={person.id} className="border border-slate-800/60">
                      <TableCell className="border border-slate-800/60 bg-slate-950/40 p-3">
                        <div>
                          <p className="font-semibold text-white">{person.label}</p>
                          <p className="text-xs text-slate-500">
                            {teamLookup[person.team]} • {person.role}
                          </p>
                        </div>
                      </TableCell>
                      {visibleDays.map((day) => {
                        const slots = gridAssignments[person.id]?.[day.id] ?? [];
                        return (
                          <TableCell
                            key={`${person.id}-${day.id}`}
                            className="border border-slate-800/60 align-top p-0">
                            <div className="divide-y divide-slate-800/60 text-xs">
                              {slots.map((slot, slotIndex) => (
                                <div key={`${person.id}-${day.id}-${slotIndex}`} className="p-3">
                                  <p className="text-sm font-medium text-white">{slot.title}</p>
                                  <p className="text-xs text-slate-400">{slot.time}</p>
                                  <p className="text-xs text-slate-500">{slot.location}</p>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-sky-400">
                <span>Spreadsheet staging</span>
                <span className="h-px w-8 bg-slate-800" />
                <span>Master · Team · Individual</span>
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-white">Upload every scenario from one surface</h2>
                <p className="mt-2 max-w-3xl text-base text-slate-400">
                  Pick the scope, drop in the CSV/XLSX, and run validations before publishing to the live grid. We’ll reuse the
                  same pipeline for master, team, or one-off staffers.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-5 rounded-2xl border border-slate-800/70 bg-slate-950/50 p-5">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Upload scope</p>
              <Tabs value={uploadScope} onValueChange={(value) => setUploadScope(value as UploadScope)}>
                <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-slate-900/60">
                  <TabsTrigger value="master" className="rounded-xl text-xs uppercase tracking-[0.2em]">
                    Master
                  </TabsTrigger>
                  <TabsTrigger value="team" className="rounded-xl text-xs uppercase tracking-[0.2em]">
                    Team
                  </TabsTrigger>
                  <TabsTrigger value="person" className="rounded-xl text-xs uppercase tracking-[0.2em]">
                    Individual
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {uploadScope !== "master" && (
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Team</Label>
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
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                    {people
                      .filter((person) => person.team === uploadTeam)
                      .map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <label
              htmlFor="consolidated-upload"
              className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 p-6 text-center transition hover:border-sky-500/60">
              <UploadCloud className="h-8 w-8 text-sky-300" />
              <div>
                <p className="text-sm font-semibold text-white">
                  {uploadScope === "master"
                    ? "Drop conference-wide spreadsheet"
                    : uploadScope === "team"
                      ? `Upload ${teamLookup[uploadTeam]} rota`
                      : `Upload schedule for ${people.find((p) => p.id === uploadPerson)?.label ?? "staffer"}`}
                </p>
                <p className="text-xs text-slate-500">CSV/XLSX · Auto-maps headers, shifts, and owners</p>
              </div>
              <input id="consolidated-upload" type="file" className="hidden" accept=".csv,.xlsx" />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                variant="outline"
                className="rounded-2xl border-slate-700 bg-slate-950/40 text-sm font-semibold text-slate-100 hover	border-sky-500/60">
                Run validations
              </Button>
              <Button className="rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400">
                Stage upload
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-800 bg-slate-900/60 p-6 lg:p-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
                <span>Schedule exports</span>
                <span className="h-px w-8 bg-slate-800" />
                <span>CSV · XLSX</span>
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-white">Export structured schedules</h2>
              <p className="text-slate-400">Produce distribution-ready extracts for compliance teams, logistics leads, or individual staffers.</p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-300">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Most recent export</p>
                <p className="font-semibold text-white">2 mins ago · CSV · Full roster</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Generated by</p>
                <p className="font-semibold text-white">Jordan King</p>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <Tabs value={downloadScope} onValueChange={(value) => setDownloadScope(value as DownloadScope)}>
                <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-slate-900/60">
                  <TabsTrigger value="all" className="rounded-xl text-xs uppercase tracking-[0.2em]">
                    All teams
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
                      Export includes every scheduled team and staffer for {downloadDayLabel}.
                    </p>
                  </TabsContent>
                  <TabsContent value="team" className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Team</Label>
                      <Select value={downloadTeam} onValueChange={setDownloadTeam}>
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
                    <p className="text-xs text-slate-500">
                      Includes only personnel assigned to {teams.find((team) => team.id === downloadTeam)?.label} for {downloadDayLabel}.
                    </p>
                  </TabsContent>
                  <TabsContent value="person" className="space-y-3">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Team</Label>
                        <Select value={downloadTeam} onValueChange={setDownloadTeam}>
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
                        <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Staffer</Label>
                        <Select value={downloadPerson} onValueChange={setDownloadPerson}>
                          <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                            <SelectValue placeholder="Person" />
                          </SelectTrigger>
                          <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                            {people
                              .filter((person) => person.team === downloadTeam)
                              .map((person) => (
                                <SelectItem key={person.id} value={person.id}>
                                  {person.label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">
                      Targets {people.find((person) => person.id === downloadPerson)?.label ?? "selected staffer"} for {downloadDayLabel}.
                    </p>
                  </TabsContent>
                </div>
              </Tabs>
              <div className="mt-6 space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Day scope</Label>
                <Select value={downloadDay} onValueChange={(value) => setDownloadDay(value as DayScope)}>
                  <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                    <SelectValue placeholder="Choose day(s)" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                    <SelectItem value="all">All days</SelectItem>
                    {gridDays.map((day) => (
                      <SelectItem key={day.id} value={day.id}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Format</Label>
                <Select value={downloadFormat} onValueChange={(value) => setDownloadFormat(value as DownloadFormat)}>
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
                Generate {downloadFormat === "csv" ? "CSV export" : "XLSX export"}
              </Button>
            </div>
          </div>
        </section>
 
        <section className="rounded-[32px] border border-slate-800 bg-slate-900/60 p-6 lg:p-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
                <span>Change log</span>
                <span className="h-px w-8 bg-slate-800" />
                <span>Uploads · Manual edits · Deletes</span>
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-white">Edit history & audit trail</h2>
            </div>
            <Button
              variant="outline"
              className="rounded-2xl border-slate-700 bg-slate-950/60 text-xs font-semibold uppercase tracking-[0.3em] text-slate-100 hover:border-sky-500/60">
              Export log
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            {historyEntries.map((entry) => {
              const meta = intentStyles[entry.intent];
              return (
                <div
                  key={entry.id}
                  className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                  <span className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${meta.accent}`} />
                  <div className="relative flex items-start gap-3">
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-2">{meta.icon}</div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-white">{entry.actor}</p>
                        <Badge className={`rounded-full border px-2 py-0.5 text-[0.65rem] ${meta.badge}`}>
                          {entry.intent}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-300">{entry.action}</p>
                      <p className="text-xs text-slate-500">{entry.detail}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.35em] text-slate-500">{entry.timestamp}</p>
                    </div>
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
