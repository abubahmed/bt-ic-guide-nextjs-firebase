"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Filter, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { staff, roomTemplates, teams } from "./data";

import StaffFooter from "../components/footer";
import StaffHeader from "../components/header";

const teamLookup = teams.reduce<Record<string, string>>((acc, team) => {
  acc[team.id] = team.label;
  return acc;
}, {});

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
  {}
);

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
    const teamPeople = staff.filter((person) => person.team === uploadTeam);
    if (!teamPeople.some((person) => person.id === uploadPerson)) {
      setUploadPerson(teamPeople[0]?.id ?? "");
    }
  }, [uploadTeam, uploadPerson]);

  useEffect(() => {
    const teamPeople = staff.filter((person) => person.team === exportTeam);
    if (!teamPeople.some((person) => person.id === exportPerson)) {
      setExportPerson(teamPeople[0]?.id ?? "");
    }
  }, [exportTeam, exportPerson]);

  useEffect(() => {
    if (filterPerson === "all") return;
    const candidate = staff.find((person) => person.id === filterPerson);
    if (!candidate || (filterTeam !== "all" && candidate.team !== filterTeam)) {
      setFilterPerson("all");
    }
  }, [filterTeam, filterPerson]);

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
      <StaffHeader currentPage="rooms" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
        <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div>
                <h2 className="text-3xl font-semibold text-white">Upload room assignments</h2>
                <p className="mt-2 text-base text-slate-400">
                  Upload room assignments via spreadsheet to the system. Ensure it matches the required format and
                  headers.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-5 rounded-2xl border border-slate-800/70 bg-slate-950/50 p-5">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Upload scope</p>
              <Tabs value={uploadScope} onValueChange={(value) => setUploadScope(value as UploadScope)}>
                <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-slate-900/60">
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
            <div className="grid gap-4 md:grid-cols-2">
            {uploadScope !== "master" && (
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Team</Label>
                <Select value={uploadTeam} onValueChange={(value) => setUploadTeam(value as any)}>
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
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Staffer</Label>
                <Select value={uploadPerson} onValueChange={setUploadPerson}>
                  <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                    <SelectValue placeholder="Select person" />
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
            <label
              htmlFor="rooms-upload"
              className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 p-6 text-center transition hover:border-sky-500/60">
              <UploadCloud className="h-8 w-8 text-sky-300" />
              <div>
                <p className="text-sm font-semibold text-white">Upload CSV/XLSX file</p>
              </div>
              <input id="rooms-upload" type="file" className="hidden" accept=".csv,.xlsx" />
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
              <div>
                <h1 className="text-3xl font-semibold text-white">View or manage room assignments</h1>
                <p className="mt-2 text-base text-slate-400">
                  Review or manage room assignments for all teams. Filter by team to find specific room assignments.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-[28px] border border-slate-800/80 bg-slate-950/50 p-4">
            <div className="mt-4 flex flex-wrap items-center gap-3">
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
                      <TableHead className="border border-slate-800/60 text-slate-400">Details</TableHead>
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
                          <TableCell className="border border-slate-800/60 p-3">
                            <p className="font-mono text-base tracking-wide text-slate-100">{slot.room}</p>
                          </TableCell>
                          <TableCell className="border border-slate-800/60 p-3">
                            <p className="text-sm font-medium text-white">{slot.type}</p>
                          </TableCell>
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

        <section className="rounded-[32px] border border-slate-800 bg-slate-900/60 p-6 shadow-[0px_30px_60px_rgba(2,6,23,0.45)] lg:p-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="mt-2 text-2xl font-semibold text-white">Export room assignments</h2>
              <p className="text-slate-400">Export room assignments for all or specific teams in CSV or XLSX format.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <Tabs value={exportScope} onValueChange={(value) => setExportScope(value as ExportScope)}>
                <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-slate-900/60">
                  <TabsTrigger
                    value="all"
                    className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                    All staff
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
                <div className="mt-6 space-y-4">
                  <TabsContent value="team" className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Team</Label>
                      <Select value={exportTeam} onValueChange={(value) => setExportTeam(value as any)}>
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
                  </TabsContent>
                  <TabsContent value="person" className="space-y-3">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Team</Label>
                        <Select value={exportTeam} onValueChange={(value) => setExportTeam(value as any)}>
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
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Staffer</Label>
                        <Select value={exportPerson} onValueChange={setExportPerson}>
                          <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                            <SelectValue placeholder="Select person" />
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
                    </div>
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
                    <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400">
                Generate {exportFormat === "csv" ? "CSV export" : "XLSX export"}
              </Button>
            </div>
          </div>
        </section>
      </div>
      <StaffFooter />
    </main>
  );
}
