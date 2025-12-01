"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldBan, UploadCloud, UserMinus2, Users2 } from "lucide-react";

import StaffFooter from "../components/footer";
import StaffHeader from "../components/header";
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
import { gradeOptions, peopleDirectory, roles, subteams } from "@/app/staff/people/data";

type UploadScope = "master" | "team" | "person";
type ExportScope = "all" | "team" | "person";
type ExportFormat = "csv" | "xlsx";
type PersonRole = (typeof roles)[number];
type SubteamId = (typeof subteams)[number]["id"];
type GradeValue = (typeof gradeOptions)[number];
type PersonRecord = (typeof peopleDirectory)[number];

type IndividualFormState = {
  fullName: string;
  email: string;
  phone: string;
  role: PersonRole;
  subteam: SubteamId | "";
  grade: GradeValue;
  company: string;
  school: string;
};

type UploadSectionProps = {
  scope: UploadScope;
  onScopeChange: (scope: UploadScope) => void;
  subteam: SubteamId;
  onSubteamChange: (subteam: SubteamId) => void;
  onRunValidations: () => void;
  onStageUpload: () => void;
  individualForm: IndividualFormState;
  onIndividualFormChange: <K extends keyof IndividualFormState>(field: K, value: IndividualFormState[K]) => void;
};

type RosterFiltersProps = {
  roleFilter: "all" | PersonRole;
  subteamFilter: "all" | SubteamId;
  gradeFilter: "all" | GradeValue;
  searchQuery: string;
  onRoleChange: (value: "all" | PersonRole) => void;
  onSubteamChange: (value: "all" | SubteamId) => void;
  onGradeChange: (value: "all" | GradeValue) => void;
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
  subteam: SubteamId;
  onSubteamChange: (subteam: SubteamId) => void;
  personId: string;
  onPersonChange: (personId: string) => void;
  format: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
  onGenerate: () => void;
};

type AccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activePerson: PersonRecord | null;
  modalRole: PersonRole;
  onRoleChange: (role: PersonRole) => void;
  modalSubteam: SubteamId | "";
  onSubteamChange: (subteam: SubteamId | "") => void;
  modalGrade: GradeValue;
  onGradeChange: (grade: GradeValue) => void;
  onRevoke: () => void;
  onApply: () => void;
};

const DEFAULT_SUBTEAM: SubteamId = subteams[0].id;
const DEFAULT_PERSON = peopleDirectory[0]?.id ?? "";
const PAGE_SIZE = 10;
const GRADE_OPTIONS = gradeOptions;

const subteamLookup = subteams.reduce<Record<SubteamId, string>>((acc, subteam) => {
  acc[subteam.id] = subteam.label;
  return acc;
}, {} as Record<SubteamId, string>);

export default function StaffPeoplePage() {
  const [uploadScope, setUploadScope] = useState<UploadScope>("master");
  const [uploadSubteam, setUploadSubteam] = useState<SubteamId>(DEFAULT_SUBTEAM);
  const [roleFilter, setRoleFilter] = useState<"all" | PersonRole>("all");
  const [subteamFilter, setSubteamFilter] = useState<"all" | SubteamId>("all");
  const [gradeFilter, setGradeFilter] = useState<"all" | GradeValue>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [gridPage, setGridPage] = useState(0);
  const [exportScope, setExportScope] = useState<ExportScope>("all");
  const [exportSubteam, setExportSubteam] = useState<SubteamId>(DEFAULT_SUBTEAM);
  const [exportPerson, setExportPerson] = useState<string>(DEFAULT_PERSON);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
  const [activePersonId, setActivePersonId] = useState<string | null>(null);
  const [modalRole, setModalRole] = useState<PersonRole>(roles[0]);
  const [modalSubteam, setModalSubteam] = useState<SubteamId | "">(subteams[0].id);
  const [modalGrade, setModalGrade] = useState<GradeValue>(gradeOptions[0]);
  const [individualForm, setIndividualForm] = useState<IndividualFormState>({
    fullName: "",
    email: "",
    phone: "",
    role: roles[0],
    subteam: subteams[0].id,
    grade: gradeOptions[0],
    company: "",
    school: "",
  });

  const activePerson = useMemo(
    () => peopleDirectory.find((person) => person.id === activePersonId) ?? null,
    [activePersonId]
  );

  useEffect(() => {
    if (activePerson) {
      setModalRole(activePerson.role);
      setModalSubteam(activePerson.subteam ?? "");
      setModalGrade(activePerson.grade);
    }
  }, [activePerson]);

  useEffect(() => {
    const scopedPeople = peopleDirectory.filter((person) => person.subteam === exportSubteam);
    if (!scopedPeople.some((person) => person.id === exportPerson)) {
      setExportPerson(scopedPeople[0]?.id ?? "");
    }
  }, [exportSubteam, exportPerson]);

  useEffect(() => {
    setGridPage(0);
  }, [roleFilter, subteamFilter, gradeFilter, searchQuery]);

  const filteredRoster = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return peopleDirectory.filter((person) => {
      if (roleFilter !== "all" && person.role !== roleFilter) {
        return false;
      }
      if (subteamFilter !== "all") {
        if (person.role !== "staff" || person.subteam !== subteamFilter) {
          return false;
        }
      }
      if (gradeFilter !== "all" && person.grade !== gradeFilter) {
        return false;
      }
      if (normalizedSearch.length > 0) {
        const haystack = `${person.fullName} ${person.email} ${person.company} ${person.school}`.toLowerCase();
        if (!haystack.includes(normalizedSearch)) {
          return false;
        }
      }
      return true;
    });
  }, [gradeFilter, roleFilter, searchQuery, subteamFilter]);

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

  const handleIndividualFormChange = <K extends keyof IndividualFormState>(field: K, value: IndividualFormState[K]) => {
    setIndividualForm((prev) => ({ ...prev, [field]: value }));
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
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(individualForm.email.trim())) {
      errors.push("A valid email address is required.");
    }
    if (!individualForm.phone.trim()) {
      errors.push("Phone number is required.");
    }
    if (!individualForm.company.trim()) {
      errors.push("Company is required.");
    }
    if (!individualForm.school.trim()) {
      errors.push("School is required.");
    }
    if (individualForm.role === "staff" && !individualForm.subteam) {
      errors.push("Subteam is required for staff roles.");
    }

    if (errors.length > 0) {
      console.warn("Individual upload validation errors:", errors);
      return false;
    }

    console.info("Individual upload passed basic validations.");
    return true;
  };

  const handleStageUpload = () => {};
  const handlePrevPage = () => setGridPage((prev) => Math.max(0, prev - 1));
  const handleNextPage = () => setGridPage((prev) => Math.min(pageCount - 1, prev + 1));
  const handleGenerateExport = () => {};
  const handleRevokeAccess = () => {};
  const handleApplyUpdates = () => {};

  return (
    <>
      <main className="min-h-dvh bg-slate-950 text-slate-100">
        <StaffHeader currentPage="people" />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
          <UploadSection
            scope={uploadScope}
            onScopeChange={setUploadScope}
            subteam={uploadSubteam}
            onSubteamChange={setUploadSubteam}
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
                  Review or manage people data for every role. Filter by role, subteam, or grade to find specifics.
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-[28px] border border-slate-800/80 bg-slate-950/50 p-4">
              <RosterFilters
                roleFilter={roleFilter}
                subteamFilter={subteamFilter}
                gradeFilter={gradeFilter}
                searchQuery={searchQuery}
                onRoleChange={setRoleFilter}
                onSubteamChange={setSubteamFilter}
                onGradeChange={setGradeFilter}
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
                  onPrev={handlePrevPage}
                  onNext={handleNextPage}
                />
              </div>
            </div>
          </section>

          <ExportSection
            scope={exportScope}
            onScopeChange={setExportScope}
            subteam={exportSubteam}
            onSubteamChange={setExportSubteam}
            personId={exportPerson}
            onPersonChange={setExportPerson}
            format={exportFormat}
            onFormatChange={setExportFormat}
            onGenerate={handleGenerateExport}
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
        modalSubteam={modalSubteam}
        onSubteamChange={setModalSubteam}
        modalGrade={modalGrade}
        onGradeChange={setModalGrade}
        onRevoke={handleRevokeAccess}
        onApply={handleApplyUpdates}
      />
    </>
  );
}

function UploadSection({
  scope,
  onScopeChange,
  subteam,
  onSubteamChange,
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
            Upload via spreadsheet or add an individual record. Keep every attendee, staffer, and admin in sync.
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
                Subteam
              </TabsTrigger>
              <TabsTrigger
                value="person"
                className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                Individual
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {scope !== "master" && (
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Subteam</Label>
            <Select value={subteam} onValueChange={(value) => onSubteamChange(value as SubteamId)}>
              <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                <SelectValue placeholder="Choose subteam" />
              </SelectTrigger>
              <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                {subteams.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {scope === "person" ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Full name</Label>
                <Input
                  value={individualForm.fullName}
                  onChange={(event) => onIndividualFormChange("fullName", event.target.value)}
                  placeholder="Alex Chen"
                  className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Email</Label>
                <Input
                  type="email"
                  value={individualForm.email}
                  onChange={(event) => onIndividualFormChange("email", event.target.value)}
                  placeholder="alex@example.com"
                  className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Phone</Label>
                <Input
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
                  onValueChange={(value) => {
                    onIndividualFormChange("role", value as PersonRole);
                    if (value !== "staff") {
                      onIndividualFormChange("subteam", "");
                    }
                  }}
                >
                  <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                    {roles.map((role) => (
                      <SelectItem key={role} value={role} className="capitalize">
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Grade</Label>
                <Select value={individualForm.grade} onValueChange={(value) => onIndividualFormChange("grade", value as GradeValue)}>
                  <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                    {GRADE_OPTIONS.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {individualForm.role === "staff" && (
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Subteam</Label>
                <Select value={individualForm.subteam} onValueChange={(value) => onIndividualFormChange("subteam", value as SubteamId)}>
                  <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                    <SelectValue placeholder="Select subteam" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                    {subteams.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Company</Label>
                <Input
                  value={individualForm.company}
                  onChange={(event) => onIndividualFormChange("company", event.target.value)}
                  placeholder="BTIC"
                  className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">School</Label>
                <Input
                  value={individualForm.school}
                  onChange={(event) => onIndividualFormChange("school", event.target.value)}
                  placeholder="University"
                  className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100"
                />
              </div>
            </div>
          </div>
        ) : (
          <label
            htmlFor="people-upload"
            className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 p-6 text-center transition hover:border-sky-500/60"
          >
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
            onClick={onRunValidations}
          >
            Run validations
          </Button>
          <Button
            className="rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400"
            onClick={onStageUpload}
          >
            Stage upload
          </Button>
        </div>
      </div>
    </section>
  );
}

function RosterFilters({
  roleFilter,
  subteamFilter,
  gradeFilter,
  searchQuery,
  onRoleChange,
  onSubteamChange,
  onGradeChange,
  onSearchChange,
}: RosterFiltersProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <Select value={roleFilter} onValueChange={(value) => onRoleChange(value as "all" | PersonRole)}>
        <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-44">
          <SelectValue placeholder="Role filter" />
        </SelectTrigger>
        <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
          <SelectItem value="all">All roles</SelectItem>
          {roles.map((role) => (
            <SelectItem key={role} value={role} className="capitalize">
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={subteamFilter} onValueChange={(value) => onSubteamChange(value as "all" | SubteamId)}>
        <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
          <SelectValue placeholder="Subteam filter" />
        </SelectTrigger>
        <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
          <SelectItem value="all">All subteams</SelectItem>
          {subteams.map((subteam) => (
            <SelectItem key={subteam.id} value={subteam.id}>
              {subteam.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={gradeFilter} onValueChange={(value) => onGradeChange(value as "all" | GradeValue)}>
        <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
          <SelectValue placeholder="Grade filter" />
        </SelectTrigger>
        <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
          <SelectItem value="all">All grades</SelectItem>
          {gradeOptions.map((grade) => (
            <SelectItem key={grade} value={grade}>
              {grade}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search name, email, company, school"
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
          <TableHead className="border border-slate-800/60 bg-slate-950/60 text-slate-400">Person</TableHead>
          <TableHead className="border border-slate-800/60 text-slate-400">Role</TableHead>
          <TableHead className="border border-slate-800/60 text-slate-400">Subteam</TableHead>
          <TableHead className="border border-slate-800/60 text-slate-400">Company</TableHead>
          <TableHead className="border border-slate-800/60 text-slate-400">School</TableHead>
          <TableHead className="border border-slate-800/60 text-slate-400">Grade</TableHead>
          <TableHead className="border border-slate-800/60 text-slate-400">Contact</TableHead>
          <TableHead className="border border-slate-800/60 text-right text-slate-400">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pagedRoster.map((person) => (
          <TableRow key={person.id} className="border border-slate-800/60">
            <TableCell className="border border-slate-800/60 bg-slate-950/40 p-3">
              <p className="font-semibold text-white">{person.fullName}</p>
            </TableCell>
            <TableCell className="border border-slate-800/60 p-3 capitalize">{person.role}</TableCell>
            <TableCell className="border border-slate-800/60 p-3">
              {person.role === "staff" && person.subteam ? subteamLookup[person.subteam] : "—"}
            </TableCell>
            <TableCell className="border border-slate-800/60 p-3">{person.company}</TableCell>
            <TableCell className="border border-slate-800/60 p-3">{person.school}</TableCell>
            <TableCell className="border border-slate-800/60 p-3">{person.grade}</TableCell>
            <TableCell className="border border-slate-800/60 p-3">
              <p className="text-sm font-medium text-white">{person.email}</p>
              <p className="text-xs text-slate-400">{person.phone}</p>
            </TableCell>
            <TableCell className="border border-slate-800/60 p-3 text-right">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-700 bg-slate-950/50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100 hover:border-sky-500/60"
                onClick={() => onManage(person.id)}
              >
                Manage
              </Button>
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
          onClick={onPrev}
        >
          Previous
        </Button>
        <span className="text-sm text-slate-300">Page {totalCount === 0 ? 0 : gridPage + 1} / {totalCount === 0 ? 0 : pageCount}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={!canGoNext}
          className="rounded-xl border-slate-700 bg-slate-950/50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100 disabled:opacity-30"
          onClick={onNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function ExportSection({
  scope,
  onScopeChange,
  subteam,
  onSubteamChange,
  personId,
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
          <p className="text-slate-400">Export every record or slice by subteam or individual.</p>
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
                Subteam
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
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Subteam</Label>
                  <Select value={subteam} onValueChange={(value) => onSubteamChange(value as SubteamId)}>
                    <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                      <SelectValue placeholder="Choose subteam" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                      {subteams.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <TabsContent value="person" className="space-y-3">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Subteam</Label>
                    <Select value={subteam} onValueChange={(value) => onSubteamChange(value as SubteamId)}>
                      <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                        <SelectValue placeholder="Subteam" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                        {subteams.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.label}
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
                          .filter((person) => person.subteam === subteam)
                          .map((person) => (
                            <SelectItem key={person.id} value={person.id}>
                              {person.fullName}
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
            onClick={onGenerate}
          >
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
  modalSubteam,
  onSubteamChange,
  modalGrade,
  onGradeChange,
  onRevoke,
  onApply,
}: AccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-800 bg-slate-950 text-slate-100">
        {activePerson ? (
          <>
            <DialogHeader className="gap-3">
              <DialogTitle className="text-2xl text-white">{activePerson.fullName}</DialogTitle>
              <DialogDescription className="text-slate-400">{activePerson.email}</DialogDescription>
            </DialogHeader>
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Role type</Label>
                  <Select
                    value={modalRole}
                    onValueChange={(value) => {
                      onRoleChange(value as PersonRole);
                      if (value !== "staff") {
                        onSubteamChange(\"\"");
                      }
                    }}
                  >
                    <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                      {roles.map((role) => (
                        <SelectItem key={role} value={role} className="capitalize">
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Grade</Label>
                  <Select value={modalGrade} onValueChange={(value) => onGradeChange(value as GradeValue)}>
                    <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                      {gradeOptions.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {modalRole === "staff" && (
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Subteam</Label>
                  <Select value={modalSubteam || ""} onValueChange={(value) => onSubteamChange(value as SubteamId)}>
                    <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                      <SelectValue placeholder="Select subteam" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                      {subteams.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4">
                <p className="text-sm font-semibold text-white">Current details</p>
                <p className="mt-2 text-xs text-slate-400">
                  {activePerson.company} · {activePerson.school}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-rose-500/50 bg-rose-500/10 text-sm font-semibold text-rose-200 hover:border-rose-400 hover:bg-rose-500/20"
                onClick={onRevoke}
              >
                <ShieldBan className="mr-2 h-4 w-4" />
                Revoke access
              </Button>
              <Button
                className="flex-1 rounded-xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400"
                onClick={onApply}
              >
                <UserMinus2 className="mr-2 h-4 w-4" />
                Apply updates
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="space-y-4 text-center">
            <Users2 className="mx-auto h-10 w-10 text-slate-500" />
            <p className="text-sm text-slate-400">Select a person from the roster to manage their record.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
