"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldBan, UploadCloud, UserMinus2, Users2 } from "lucide-react";

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
import { teams, staffTypes, peopleDirectory, statusStyles, accessStyles } from "@/app/staff/people/data";

import StaffFooter from "../components/footer";
import StaffHeader from "../components/header";

type UploadScope = "master" | "team" | "person";
type ExportScope = "all" | "team" | "person";
type ExportFormat = "csv" | "xlsx";
type AccessRole = "staff" | "attendee";
type PersonStatus = "active" | "invited" | "revoked";
type TeamId = (typeof teams)[number]["id"];
type StaffTypeId = (typeof staffTypes)[number]["id"];
type PersonRecord = (typeof peopleDirectory)[number] & {
  staffType?: StaffTypeId;
};

const teamLookup = teams.reduce<Record<TeamId, string>>((acc, team) => {
  acc[team.id] = team.label;
  return acc;
}, {} as Record<TeamId, string>);

const DEFAULT_TEAM: TeamId = teams[0].id;
const DEFAULT_PERSON = peopleDirectory.find((person) => person.team === DEFAULT_TEAM)?.id ?? peopleDirectory[0].id;
const PAGE_SIZE = 10;

type UploadSectionProps = {
  scope: UploadScope;
  onScopeChange: (scope: UploadScope) => void;
  team: TeamId;
  onTeamChange: (team: TeamId) => void;
  personId: string;
  onPersonChange: (personId: string) => void;
};

type RosterFiltersProps = {
  teamFilter: "all" | TeamId;
  accessFilter: "all" | AccessRole;
  statusFilter: "all" | PersonStatus;
  searchQuery: string;
  onTeamChange: (value: "all" | TeamId) => void;
  onAccessChange: (value: "all" | AccessRole) => void;
  onStatusChange: (value: "all" | PersonStatus) => void;
  onSearchChange: (value: string) => void;
};

type RosterTableProps = {
  pagedRoster: PersonRecord[];
  onManage: (personId: string) => void;
};

type PaginationControlsProps = {
  pageStart: number;
  pageEnd: number;
  totalCount: number;
  gridPage: number;
  pageCount: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

type ExportSectionProps = {
  scope: ExportScope;
  onScopeChange: (scope: ExportScope) => void;
  team: TeamId;
  onTeamChange: (team: TeamId) => void;
  personId: string;
  onPersonChange: (personId: string) => void;
  format: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
};

type AccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activePerson: PersonRecord | null;
  modalRole: AccessRole;
  onRoleChange: (role: AccessRole) => void;
  modalStaffType: StaffTypeId;
  onStaffTypeChange: (staffType: StaffTypeId) => void;
};

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
        <StaffHeader currentPage="people" />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
          <UploadSection
            scope={uploadScope}
            onScopeChange={setUploadScope}
            team={uploadTeam}
            onTeamChange={setUploadTeam}
            personId={uploadPerson}
            onPersonChange={setUploadPerson}
          />

          <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8">
            <div className="space-y-3">
              <div>
                <h2 className="text-3xl font-semibold text-white">People viewer</h2>
                <p className="mt-2 text-base text-slate-400">
                  Review or manage people data for all teams. Filter by team, role, or status to find specific people.
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-[28px] border border-slate-800/80 bg-slate-950/50 p-4">
              <RosterFilters
                teamFilter={teamFilter}
                accessFilter={accessFilter}
                statusFilter={statusFilter}
                searchQuery={searchQuery}
                onTeamChange={setTeamFilter}
                onAccessChange={setAccessFilter}
                onStatusChange={setStatusFilter}
                onSearchChange={setSearchQuery}
              />
              <div className="mt-4">
                {pagedRoster.length > 0 ? (
                  <RosterTable pagedRoster={pagedRoster} onManage={handleOpenDialog} />
                ) : (
                  <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-6 text-center text-sm text-slate-400">
                    No people match the applied filters.
                  </div>
                )}
                <PaginationControls
                  pageStart={pageStart}
                  pageEnd={pageEnd}
                  totalCount={filteredRoster.length}
                  gridPage={filteredRoster.length === 0 ? 0 : gridPage}
                  pageCount={filteredRoster.length === 0 ? 0 : pageCount}
                  canGoPrev={gridPage > 0}
                  canGoNext={gridPage < pageCount - 1 && filteredRoster.length > 0}
                  onPrev={() => setGridPage((prev) => Math.max(0, prev - 1))}
                  onNext={() => setGridPage((prev) => Math.min(pageCount - 1, prev + 1))}
                />
              </div>
            </div>
          </section>

          <ExportSection
            scope={exportScope}
            onScopeChange={setExportScope}
            team={exportTeam}
            onTeamChange={setExportTeam}
            personId={exportPerson}
            onPersonChange={setExportPerson}
            format={exportFormat}
            onFormatChange={setExportFormat}
          />
        </div>
        <StaffFooter />
      </main>

      <AccessDialog
        open={accessDialogOpen}
        onOpenChange={handleDialogChange}
        activePerson={activePerson}
        modalRole={modalRole}
        onRoleChange={setModalRole}
        modalStaffType={modalStaffType}
        onStaffTypeChange={setModalStaffType}
      />
    </>
  );
}

function UploadSection({ scope, onScopeChange, team, onTeamChange, personId, onPersonChange }: UploadSectionProps) {
  return (
    <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8">
      <div className="space-y-3">
        <div>
          <h1 className="text-3xl font-semibold text-white">Upload people data</h1>
          <p className="mt-2 text-base text-slate-400">
            Upload people data via spreadsheet to the system. Ensure it matches the required format and headers.
          </p>
        </div>
      </div>
      <div className="mt-6 space-y-5 rounded-2xl border border-slate-800/70 bg-slate-950/50 p-5">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Upload scope</p>
          <Tabs value={scope} onValueChange={(value) => onScopeChange(value as UploadScope)}>
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
        <div className="grid gap-4 md:grid-cols-2">
          {scope !== "master" && (
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Team</Label>
              <Select value={team} onValueChange={(value) => onTeamChange(value as TeamId)}>
                <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                  <SelectValue placeholder="Choose team" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                  {teams.map((teamOption) => (
                    <SelectItem key={teamOption.id} value={teamOption.id}>
                      {teamOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {scope === "person" && (
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Individual</Label>
              <Select value={personId} onValueChange={onPersonChange}>
                <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                  {peopleDirectory
                    .filter((person) => person.team === team)
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
          htmlFor="people-upload"
          className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 p-6 text-center transition hover:border-sky-500/60">
          <UploadCloud className="h-8 w-8 text-sky-300" />
          <div>
            <p className="text-sm font-semibold text-white">Upload CSV/XLSX file</p>
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
  );
}

function RosterFilters({
  teamFilter,
  accessFilter,
  statusFilter,
  searchQuery,
  onTeamChange,
  onAccessChange,
  onStatusChange,
  onSearchChange,
}: RosterFiltersProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <Select value={teamFilter} onValueChange={(value) => onTeamChange(value as "all" | TeamId)}>
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
      <Select value={accessFilter} onValueChange={(value) => onAccessChange(value as "all" | AccessRole)}>
        <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
          <SelectValue placeholder="Access filter" />
        </SelectTrigger>
        <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
          <SelectItem value="all">Staff + Attendees</SelectItem>
          <SelectItem value="staff">Staff</SelectItem>
          <SelectItem value="attendee">Attendees</SelectItem>
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={(value) => onStatusChange(value as "all" | PersonStatus)}>
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
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search name or email"
        className="w-full rounded-2xl border-slate-700 bg-slate-950/30 text-slate-100 placeholder:text-slate-500 sm:w-64"
      />
    </div>
  );
}

function RosterTable({ pagedRoster, onManage }: RosterTableProps) {
  return (
    <Table className="border-collapse text-sm text-slate-200 [&_td]:align-top">
      <TableHeader>
        <TableRow className="bg-slate-900/70 text-xs uppercase tracking-[0.25em] text-slate-500">
          <TableHead className="min-w-[240px] border border-slate-800/60 bg-slate-950/60 text-slate-400">Person</TableHead>
          <TableHead className="border border-slate-800/60 text-slate-400">Email</TableHead>
          <TableHead className="border border-slate-800/60 text-slate-400">Team</TableHead>
          <TableHead className="border border-slate-800/60 text-slate-400">Access</TableHead>
          <TableHead className="border border-slate-800/60 text-slate-400">Status</TableHead>
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
              </TableCell>
              <TableCell className="border border-slate-800/60 p-3">
                <p className="text-sm font-medium text-white">{person.email}</p>
              </TableCell>
              <TableCell className="border border-slate-800/60 p-3">
                <p className="text-sm font-medium text-white">{teamLookup[person.team]}</p>
              </TableCell>
              <TableCell className="border border-slate-800/60 p-3">
                <div className="flex flex-wrap gap-2">
                  <Badge className={`rounded-full px-3 py-1 text-[0.65rem] ${accessStyle.badge}`}>
                    {accessStyle.label}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="border border-slate-800/60 p-3">
                <div className="space-y-1">
                  <Badge className={`rounded-full px-3 py-1 text-[0.65rem] ${statusStyle.badge}`}>
                    {statusStyle.label}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="border border-slate-800/60 p-3 text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-slate-700 bg-slate-950/50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100 hover:border-sky-500/60"
                  onClick={() => onManage(person.id)}>
                  Manage
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function PaginationControls({
  pageStart,
  pageEnd,
  totalCount,
  gridPage,
  pageCount,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
}: PaginationControlsProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
      <p>
        {totalCount === 0 ? "No people to display." : `Showing ${pageStart}–${pageEnd} of ${totalCount} people`}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!canGoPrev}
          className="rounded-xl border-slate-700 bg-slate-950/50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100 disabled:opacity-30"
          onClick={onPrev}>
          Previous
        </Button>
        <span className="text-sm text-slate-300">
          Page {totalCount === 0 ? 0 : gridPage + 1} / {totalCount === 0 ? 0 : pageCount}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!canGoNext}
          className="rounded-xl border-slate-700 bg-slate-950/50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100 disabled:opacity-30"
          onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}

function ExportSection({
  scope,
  onScopeChange,
  team,
  onTeamChange,
  personId,
  onPersonChange,
  format,
  onFormatChange,
}: ExportSectionProps) {
  return (
    <section className="rounded-[32px] border border-slate-800 bg-slate-900/60 p-6 shadow-[0px_30px_60px_rgba(2,6,23,0.45)] lg:p-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="mt-2 text-2xl font-semibold text-white">Export people data</h2>
          <p className="text-slate-400">Export people data for all or specific teams in CSV or XLSX format.</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
          <Tabs value={scope} onValueChange={(value) => onScopeChange(value as ExportScope)}>
            <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-slate-900/60">
              <TabsTrigger
                value="all"
                className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                Everyone
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
                  <Select value={team} onValueChange={(value) => onTeamChange(value as TeamId)}>
                    <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                      <SelectValue placeholder="Choose team" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                      {teams.map((teamOption) => (
                        <SelectItem key={teamOption.id} value={teamOption.id}>
                          {teamOption.label}
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
                    <Select value={team} onValueChange={(value) => onTeamChange(value as TeamId)}>
                      <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                        <SelectValue placeholder="Team" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                        {teams.map((teamOption) => (
                          <SelectItem key={teamOption.id} value={teamOption.id}>
                            {teamOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Person</Label>
                    <Select value={personId} onValueChange={onPersonChange}>
                      <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                        <SelectValue placeholder="Person" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                        {peopleDirectory
                          .filter((person) => person.team === team)
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
            <Select value={format} onValueChange={(value) => onFormatChange(value as ExportFormat)}>
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
            Generate {format === "csv" ? "CSV roster" : "XLSX roster"}
          </Button>
        </div>
      </div>
    </section>
  );
}

function AccessDialog({
  open,
  onOpenChange,
  activePerson,
  modalRole,
  onRoleChange,
  modalStaffType,
  onStaffTypeChange,
}: AccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-800 bg-slate-950 text-slate-100">
        {activePerson ? (
          <>
            <DialogHeader className="gap-3">
              <DialogTitle className="text-2xl text-white">{activePerson.name}</DialogTitle>
              <DialogDescription className="text-slate-400">{activePerson.email}</DialogDescription>
            </DialogHeader>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Role type</Label>
                <Tabs value={modalRole} onValueChange={(value) => onRoleChange(value as AccessRole)}>
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
                  <Select value={modalStaffType} onValueChange={(value) => onStaffTypeChange(value as StaffTypeId)}>
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
                  <Badge className={`rounded-full px-3 py-1 text-[0.65rem] ${statusStyles[activePerson.status].badge}`}>
                    {statusStyles[activePerson.status].label}
                  </Badge>
                  <Badge
                    className={`rounded-full px-3 py-1 text-[0.65rem] ${accessStyles[activePerson.accessRole].badge}`}>
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
  );
}
