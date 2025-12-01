"use client";

import { useEffect, useMemo, useState } from "react";
import { UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { teams, peopleDirectory } from "@/app/staff/people/data";

import StaffFooter from "../components/footer";
import StaffHeader from "../components/header";

type UploadScope = "master" | "team" | "person";
type ExportScope = "all" | "team" | "person";
type ExportFormat = "csv" | "xlsx";
type TeamId = (typeof teams)[number]["id"];
type PersonRecord = (typeof peopleDirectory)[number];
type PersonRole = PersonRecord["role"];
type IndividualRole = Exclude<PersonRole, "admin">;
type IndividualFormState = {
  fullName: string;
  email: string;
  phone: string;
  role: IndividualRole;
  subteam: TeamId | "";
};

const teamLookup = teams.reduce<Record<TeamId, string>>((acc, team) => {
  acc[team.id] = team.label;
  return acc;
}, {} as Record<TeamId, string>);

const DEFAULT_TEAM: TeamId = teams[0].id;
const DEFAULT_PERSON_EMAIL =
  peopleDirectory.find((person) => person.subteam === DEFAULT_TEAM)?.email ?? peopleDirectory[0].email;
const PAGE_SIZE = 10;
const INDIVIDUAL_ROLE_OPTIONS: IndividualRole[] = ["staff", "attendee"];
const ROLE_FILTER_OPTIONS: PersonRole[] = ["staff", "attendee", "admin"];

type UploadSectionProps = {
  scope: UploadScope;
  onScopeChange: (scope: UploadScope) => void;
  team: TeamId;
  onTeamChange: (team: TeamId) => void;
  onRunValidations: () => void;
  onStageUpload: () => void;
  individualForm: IndividualFormState;
  onIndividualFormChange: (
    field: keyof IndividualFormState,
    value: IndividualFormState[keyof IndividualFormState]
  ) => void;
};

type RosterFiltersProps = {
  teamFilter: "all" | TeamId;
  roleFilter: "all" | PersonRole;
  searchQuery: string;
  onTeamChange: (value: "all" | TeamId) => void;
  onRoleChange: (value: "all" | PersonRole) => void;
  onSearchChange: (value: string) => void;
};

type RosterTableProps = {
  pagedRoster: PersonRecord[];
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
  personEmail: string;
  onPersonChange: (personEmail: string) => void;
  format: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
  onGenerate: () => void;
};

export default function StaffPeoplePage() {
  const [uploadScope, setUploadScope] = useState<UploadScope>("master");
  const [uploadTeam, setUploadTeam] = useState<TeamId>(DEFAULT_TEAM);
  const [teamFilter, setTeamFilter] = useState<"all" | TeamId>("all");
  const [roleFilter, setRoleFilter] = useState<"all" | PersonRole>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [gridPage, setGridPage] = useState(0);
  const [exportScope, setExportScope] = useState<ExportScope>("all");
  const [exportTeam, setExportTeam] = useState<TeamId>(DEFAULT_TEAM);
  const [exportPersonEmail, setExportPersonEmail] = useState<string>(DEFAULT_PERSON_EMAIL);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");
  const [individualForm, setIndividualForm] = useState<IndividualFormState>({
    fullName: "",
    email: "",
    phone: "",
    role: "staff",
    subteam: DEFAULT_TEAM,
  });

  useEffect(() => {
    const scopedPeople = peopleDirectory.filter((person) => person.subteam === exportTeam);
    if (!scopedPeople.some((person) => person.email === exportPersonEmail)) {
      setExportPersonEmail(scopedPeople[0]?.email ?? peopleDirectory[0].email);
    }
  }, [exportTeam, exportPersonEmail]);

  useEffect(() => {
    setGridPage(0);
  }, [teamFilter, roleFilter, searchQuery]);

  const filteredRoster = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return peopleDirectory.filter((person) => {
      if (teamFilter !== "all" && person.subteam !== teamFilter) {
        return false;
      }
      if (roleFilter !== "all" && person.role !== roleFilter) {
        return false;
      }
      if (normalizedSearch.length > 0) {
        const haystack = `${person.full_name} ${person.email}`.toLowerCase();
        if (!haystack.includes(normalizedSearch)) {
          return false;
        }
      }
      return true;
    });
  }, [teamFilter, roleFilter, searchQuery]);

  useEffect(() => {
    const maxPageIndex = Math.max(0, Math.ceil(filteredRoster.length / PAGE_SIZE) - 1);
    setGridPage((prev) => Math.min(prev, maxPageIndex));
  }, [filteredRoster.length]);

  const pagedRoster = filteredRoster.slice(gridPage * PAGE_SIZE, gridPage * PAGE_SIZE + PAGE_SIZE);
  const pageCount = Math.max(1, Math.ceil(filteredRoster.length / PAGE_SIZE));
  const pageStart = filteredRoster.length === 0 ? 0 : gridPage * PAGE_SIZE + 1;
  const pageEnd = Math.min(filteredRoster.length, (gridPage + 1) * PAGE_SIZE);

  const handleIndividualFormChange = <K extends keyof IndividualFormState>(field: K, value: IndividualFormState[K]) => {
    setIndividualForm((prev) => {
      if (field === "role") {
        const nextRole = value as IndividualRole;
        return {
          ...prev,
          role: nextRole,
          subteam: nextRole === "staff" ? (prev.subteam || DEFAULT_TEAM) : "",
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleRunValidations = () => {
    if (uploadScope !== "person") {
      console.info(`[Validations] ${uploadScope} scope currently relies on external spreadsheet validation.`);
      return true;
    }

    const errors: string[] = [];
    if (!individualForm.fullName.trim()) {
      errors.push("Full name is required.");
    }
    const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailPattern.test(individualForm.email.trim())) {
      errors.push("A valid email address is required.");
    }
    if (!individualForm.phone.trim()) {
      errors.push("Phone number is required.");
    }
    if (individualForm.role === "staff" && !individualForm.subteam) {
      errors.push("Subteam is required for staff roles.");
    }
    if (individualForm.role === "admin") {
      errors.push("Admin role assignments are not allowed via this form.");
    }

    if (errors.length > 0) {
      console.warn("Individual upload validation errors:", errors);
      return false;
    }

    console.info("Individual upload passed basic validations.");
    return true;
  };

  const handleStageUpload = () => {};

  const handlePrevPage = () => {
    setGridPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setGridPage((prev) => Math.min(pageCount - 1, prev + 1));
  };

  const handleGenerateExport = () => {};

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
            onRunValidations={handleRunValidations}
            onStageUpload={handleStageUpload}
            individualForm={individualForm}
            onIndividualFormChange={handleIndividualFormChange}
          />

          <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8">
            <div className="space-y-3">
              <div>
                <h2 className="text-3xl font-semibold text-white">People viewer</h2>
                <p className="mt-2 text-base text-slate-400">
                  Review or manage people data for all teams. Filter by subteam or role to find specific people.
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-[28px] border border-slate-800/80 bg-slate-950/50 p-4">
              <RosterFilters
                teamFilter={teamFilter}
                roleFilter={roleFilter}
                searchQuery={searchQuery}
                onTeamChange={setTeamFilter}
                onRoleChange={setRoleFilter}
                onSearchChange={setSearchQuery}
              />
              <div className="mt-4">
                {pagedRoster.length > 0 ? (
                  <RosterTable pagedRoster={pagedRoster} />
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
                  onPrev={handlePrevPage}
                  onNext={handleNextPage}
                />
              </div>
            </div>
          </section>

          <ExportSection
            scope={exportScope}
            onScopeChange={setExportScope}
            team={exportTeam}
            onTeamChange={setExportTeam}
            personEmail={exportPersonEmail}
            onPersonChange={setExportPersonEmail}
            format={exportFormat}
            onFormatChange={setExportFormat}
            onGenerate={handleGenerateExport}
          />
        </div>
        <StaffFooter />
      </main>

    </>
  );
}

function UploadSection({
  scope,
  onScopeChange,
  team,
  onTeamChange,
  onRunValidations,
  onStageUpload,
  individualForm,
  onIndividualFormChange,
}: UploadSectionProps) {
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
        </div>
        {scope === "person" ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Full name</Label>
                <Input
                  value={individualForm.fullName}
                  onChange={(event) => onIndividualFormChange("fullName", event.target.value)}
                  placeholder="Jane Doe"
                  className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Email</Label>
                <Input
                  type="email"
                  value={individualForm.email}
                  onChange={(event) => onIndividualFormChange("email", event.target.value)}
                  placeholder="jane@example.com"
                  className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Phone</Label>
                <Input
                  type="tel"
                  value={individualForm.phone}
                  onChange={(event) => onIndividualFormChange("phone", event.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Role</Label>
                <Select
                  value={individualForm.role}
                  onValueChange={(value) => onIndividualFormChange("role", value as IndividualRole)}>
                  <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                    {INDIVIDUAL_ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {individualForm.role === "staff" && (
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Subteam</Label>
                <Select value={individualForm.subteam} onValueChange={(value) => onIndividualFormChange("subteam", value as TeamId)}>
                  <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                    <SelectValue placeholder="Select subteam" />
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
          </div>
        ) : (
          <label
            htmlFor="people-upload"
            className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 p-6 text-center transition hover:border-sky-500/60">
            <UploadCloud className="h-8 w-8 text-sky-300" />
            <div>
              <p className="text-sm font-semibold text-white">Upload CSV/XLSX file</p>
            </div>
            <input id="people-upload" type="file" className="hidden" accept=".csv,.xlsx" />
          </label>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            className="rounded-2xl border-slate-700 bg-slate-950/40 text-sm font-semibold text-slate-100 hover:border-sky-500/60"
            onClick={onRunValidations}>
            Run validations
          </Button>
          <Button
            className="rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400"
            onClick={onStageUpload}>
            Stage upload
          </Button>
        </div>
      </div>
    </section>
  );
}

function RosterFilters({
  teamFilter,
  roleFilter,
  searchQuery,
  onTeamChange,
  onRoleChange,
  onSearchChange,
}: RosterFiltersProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <Select value={teamFilter} onValueChange={(value) => onTeamChange(value as "all" | TeamId)}>
        <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
          <SelectValue placeholder="Subteam filter" />
        </SelectTrigger>
        <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
          <SelectItem value="all">All subteams</SelectItem>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={roleFilter} onValueChange={(value) => onRoleChange(value as "all" | PersonRole)}>
        <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
          <SelectValue placeholder="Role filter" />
        </SelectTrigger>
        <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
          <SelectItem value="all">Staff + Attendees</SelectItem>
          {ROLE_FILTER_OPTIONS.map((role) => (
            <SelectItem key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </SelectItem>
          ))}
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

function RosterTable({ pagedRoster }: RosterTableProps) {
  return (
    <Table className="border-collapse text-sm text-slate-200 [&_td]:align-top">
      <TableHeader>
        <TableRow className="bg-slate-900/70 text-xs uppercase tracking-[0.25em] text-slate-500">
          <TableHead className="min-w-[240px] border border-slate-800/60 bg-slate-950/60 text-slate-400">
            Person
          </TableHead>
          <TableHead className="border border-slate-800/60 text-slate-400">Email</TableHead>
          <TableHead className="border border-slate-800/60 text-slate-400">Phone</TableHead>
          <TableHead className="border border-slate-800/60 text-slate-400">Role</TableHead>
          <TableHead className="border border-slate-800/60 text-slate-400">Subteam</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pagedRoster.map((person) => (
          <TableRow key={person.email} className="border border-slate-800/60">
            <TableCell className="border border-slate-800/60 bg-slate-950/40 p-3">
              <p className="font-semibold text-white">{person.full_name}</p>
            </TableCell>
            <TableCell className="border border-slate-800/60 p-3">
              <p className="text-sm font-medium text-white">{person.email}</p>
            </TableCell>
            <TableCell className="border border-slate-800/60 p-3">
              <p className="text-sm font-medium text-white">{person.phone}</p>
            </TableCell>
            <TableCell className="border border-slate-800/60 p-3 capitalize">
              {person.role}
            </TableCell>
            <TableCell className="border border-slate-800/60 p-3">
              <p className="text-sm font-medium text-white">
                {person.subteam ? teamLookup[person.subteam] : "—"}
              </p>
            </TableCell>
          </TableRow>
        ))}
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
      <p>{totalCount === 0 ? "No people to display." : `Showing ${pageStart}–${pageEnd} of ${totalCount} people`}</p>
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
  personEmail,
  onPersonChange,
  format,
  onFormatChange,
  onGenerate,
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
                    <Select value={personEmail} onValueChange={onPersonChange}>
                      <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                        <SelectValue placeholder="Person" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                        {peopleDirectory
                          .filter((person) => person.subteam === team)
                          .map((person) => (
                            <SelectItem key={person.email} value={person.email}>
                              {person.full_name}
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
          <Button
            className="w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400"
            onClick={onGenerate}>
            Generate {format === "csv" ? "CSV roster" : "XLSX roster"}
          </Button>
        </div>
      </div>
    </section>
  );
}

