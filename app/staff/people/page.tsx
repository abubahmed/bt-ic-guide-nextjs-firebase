"use client";

import { useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { ShieldBan, UploadCloud, UserMinus2, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  teams,
  roles,
  accessStatuses,
  grades,
  peopleDirectory,
  statusStyles,
  accessStyles,
} from "@/app/staff/people/data";
import StaffHeader from "../components/header";
import StaffFooter from "../components/footer";
import { StaffSectionSkeleton } from "../components/skeleton";
import { AccessStatus, Grade, Role, Subteam, User } from "@/schemas/database";
import {
  fetchPeopleActionClient,
  stageFileUploadActionClient,
  stageIndividualUploadActionClient,
} from "@/actions/people/client";
import { validatePersonFrontend, validatePersonsFrontend } from "@/validators/persons";
import { Person } from "@/schemas/uploads";
import { validateUploadedFile } from "@/validators/upload";

type UploadScope = "spreadsheet" | "individual";
type ExportScope = "all" | "group" | "individual";
type ExportFormat = "csv" | "xlsx";

type RoleFilter = "all" | Role;
type SubteamFilter = "all" | Subteam;
type StatusFilter = "all" | AccessStatus;

type IndividualFormState = {
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  subteam: Subteam | "";
  grade: Grade | "";
  company: string;
  school: string;
};

type LoadingState = {
  fetch: boolean;
  upload: boolean;
  revoke: boolean;
  apply: boolean;
  export: boolean;
};

const UPLOAD_SCOPES: UploadScope[] = ["spreadsheet", "individual"];
const EXPORT_SCOPES: ExportScope[] = ["all", "group", "individual"];
const EXPORT_FORMATS: Record<ExportFormat, string> = {
  csv: "CSV (spreadsheet ready)",
  xlsx: "Excel spreadsheet (.xlsx)",
};

const DEFAULT_TEAM: Subteam = "logistics";
const DEFAULT_ROLE: Role = "attendee";
const DEFAULT_GRADE: Grade = "freshman";
const DEFAULT_PERSON: User | undefined = peopleDirectory.find((person) => person.subteam === DEFAULT_TEAM);
const PAGE_SIZE = 10;

const MAX_UPLOAD_SIZE_MB = 10;
const TEXT_COLUMN_CONFIGS: Array<{
  key: "phone" | "company" | "school" | "grade";
  label: string;
  accessor: (person: User) => string;
}> = [
  {
    key: "phone",
    label: "Phone",
    accessor: (person) => person.phoneNumber ?? "—",
  },
  {
    key: "company",
    label: "Company",
    accessor: (person) => person.company ?? "—",
  },
  {
    key: "school",
    label: "School",
    accessor: (person) => person.school ?? "—",
  },
  {
    key: "grade",
    label: "Grade",
    accessor: (person) => person.grade ?? "—",
  },
];

type ColumnVisibility = {
  person: boolean;
  email: boolean;
  subteam: boolean;
  role: boolean;
  phone: boolean;
  company: boolean;
  school: boolean;
  grade: boolean;
  status: boolean;
  actions: boolean;
};

const COLUMN_CONTROLS: Array<{ key: keyof ColumnVisibility; label: string }> = [
  { key: "person", label: "Person" },
  { key: "email", label: "Email" },
  { key: "subteam", label: "Subteam" },
  { key: "role", label: "Role" },
  { key: "phone", label: "Phone" },
  { key: "company", label: "Company" },
  { key: "school", label: "School" },
  { key: "grade", label: "Grade" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

const DEFAULT_COLUMN_VISIBILITY = {
  person: true,
  email: true,
  subteam: true,
  role: true,
  phone: false,
  company: false,
  school: false,
  grade: false,
  status: true,
  actions: true,
};

const API_LATENCY_MS = 3000;

const simulateNetworkLatency = () => new Promise((resolve) => setTimeout(resolve, API_LATENCY_MS));

async function revokePersonAccess(personId: string): Promise<void> {
  await simulateNetworkLatency();
  console.info(`[Access] Revoked person=${personId}`);
}

async function applyPersonAccessUpdates(
  personId: string,
  updates: {
    role: Role;
    subteam?: Subteam;
  }
): Promise<void> {
  await simulateNetworkLatency();
  console.info("[Access] Updated person", { personId, updates });
}

async function generatePeopleExport(params: {
  scope: ExportScope;
  role?: Role;
  subteam?: Subteam;
  personId?: string | null;
  format: ExportFormat;
}): Promise<void> {
  await simulateNetworkLatency();
  console.info("[Export] Started generation", params);
}

export default function StaffPeoplePage() {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    fetch: true,
    upload: false,
    revoke: false,
    apply: false,
    export: false,
  });
  const [peopleDataset, setPeopleDataset] = useState<User[]>([]);
  const isGlobalLocked = useMemo(() => Object.values(loadingState).some(Boolean), [loadingState]);

  useEffect(() => {
    let isMounted = true;
    const hydrate = async () => {
      try {
        const people = await fetchPeopleActionClient();
        setPeopleDataset(people || []);
      } finally {
        if (isMounted) {
          setLoadingState((prev) => ({ ...prev, fetch: false }));
        }
      }
    };
    hydrate();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <main className="min-h-dvh bg-slate-950 text-slate-100">
        <StaffHeader currentPage="people" />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
          {loadingState.fetch ? (
            <>
              <StaffSectionSkeleton
                blocks={[
                  { lines: 2, contentHeight: "h-12" },
                  { lines: 4, contentHeight: "h-56" },
                ]}
                footerItems={2}
              />
              <StaffSectionSkeleton
                blocks={[
                  { lines: 3, contentHeight: "h-16" },
                  { lines: 2, contentHeight: "h-14" },
                  { lines: 4, contentHeight: "h-80" },
                ]}
              />
              <StaffSectionSkeleton
                blocks={[
                  { lines: 3, contentHeight: "h-36" },
                  { lines: 2, contentHeight: "h-28" },
                ]}
                footerItems={1}
                className="bg-slate-900/60"
              />
            </>
          ) : (
            <>
              <UploadPanel loadingState={loadingState} setLoadingState={setLoadingState} isLocked={isGlobalLocked} />
              <RosterViewer
                loadingState={loadingState}
                setLoadingState={setLoadingState}
                isLocked={isGlobalLocked}
                peopleDataset={peopleDataset}
              />
              <ExportPanel loadingState={loadingState} setLoadingState={setLoadingState} isLocked={isGlobalLocked} />
            </>
          )}
        </div>
        <StaffFooter />
      </main>
    </>
  );
}

function UploadPanel({
  loadingState,
  setLoadingState,
  isLocked,
}: {
  loadingState: LoadingState;
  setLoadingState: Dispatch<SetStateAction<LoadingState>>;
  isLocked: boolean;
}) {
  const [scope, setScope] = useState<UploadScope>("spreadsheet");
  const [individualForm, setIndividualForm] = useState<IndividualFormState>({
    fullName: "",
    email: "",
    phone: "",
    role: DEFAULT_ROLE,
    subteam: DEFAULT_TEAM,
    grade: DEFAULT_GRADE,
    company: "",
    school: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isLocked) return;
    setLoadingState((prev) => ({ ...prev, upload: true }));

    try {
      const file = event.target.files?.[0] ?? null;
      if (!file) {
        console.error("No file selected");
        setFile(null);
        return;
      } else if (file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
        console.error(`File size exceeds ${MAX_UPLOAD_SIZE_MB}MB`);
        setFile(null);
        return;
      }

      setFile(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      setFile(null);
    } finally {
      event.target.value = "";
      setLoadingState((prev) => ({ ...prev, upload: false }));
    }
  };

  const handleIndividualFormChange = <K extends keyof IndividualFormState>(field: K, value: IndividualFormState[K]) => {
    if (isLocked) return;
    setIndividualForm((prev) => {
      if (field === "role") {
        const nextRole = value as Role;
        return {
          ...prev,
          role: nextRole,
          subteam: nextRole === "staff" ? prev.subteam || DEFAULT_TEAM : "",
        };
      }
      if (field === "subteam") {
        return {
          ...prev,
          subteam: value as Subteam,
        };
      }
      return { ...prev, [field]: value } as IndividualFormState;
    });
  };

  const handleRunValidations = async () => {
    if (isLocked) return;
    setLoadingState((prev) => ({ ...prev, validations: true }));

    try {
      if (scope === "individual") {
        const errors = await validatePersonFrontend(individualForm as Person);
        if (errors.length > 0) {
          console.error(errors);
          return false;
        }
      } else if (scope === "spreadsheet") {
        const { errors: uploadErrors, parsed } = await validateUploadedFile(file as File);
        if (uploadErrors.length > 0) {
          console.error(uploadErrors);
          return false;
        }
        const { errors: personsErrors } = await validatePersonsFrontend(parsed);
        if (personsErrors.length > 0) {
          console.error(personsErrors);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error(error);
      setLoadingState((prev) => ({ ...prev, validations: false }));
      return false;
    } finally {
      setLoadingState((prev) => ({ ...prev, validations: false }));
    }
  };

  const handleStageUpload = async () => {
    if (isLocked) return;
    setLoadingState((prev) => ({ ...prev, upload: true }));

    try {
      const isValid = await handleRunValidations();
      if (!isValid) {
        console.error("Validation failed");
        return;
      }

      if (scope === "individual") {
        await stageIndividualUploadActionClient(individualForm as Person);
      } else if (scope === "spreadsheet") {
        await stageFileUploadActionClient(file as File);
      }
    } catch (error) {
      console.error("Error staging upload:", error);
    } finally {
      setLoadingState((prev) => ({ ...prev, upload: false }));
    }
  };
  const isUploadLoading = loadingState.upload;

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
          <Tabs
            value={scope}
            onValueChange={(value) => {
              setScope(value as UploadScope);
              setFile(null);
              setIndividualForm({
                fullName: "",
                email: "",
                phone: "",
                role: DEFAULT_ROLE,
                subteam: DEFAULT_TEAM,
                grade: DEFAULT_GRADE,
                company: "",
                school: "",
              });
            }}>
            <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-slate-900/60 text-white">
              {UPLOAD_SCOPES.map((scope) => (
                <TabsTrigger
                  key={scope}
                  value={scope}
                  className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                  {scope}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        {scope === "individual" ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Full name</Label>
                <Input
                  value={individualForm.fullName}
                  onChange={(event) => handleIndividualFormChange("fullName", event.target.value)}
                  placeholder="Jane Doe"
                  className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Email</Label>
                <Input
                  type="email"
                  value={individualForm.email}
                  onChange={(event) => handleIndividualFormChange("email", event.target.value)}
                  placeholder="jane@example.com"
                  className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Phone</Label>
                <Input
                  type="tel"
                  value={individualForm.phone}
                  onChange={(event) => handleIndividualFormChange("phone", event.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Role</Label>
                <Select
                  value={individualForm.role}
                  onValueChange={(value) => handleIndividualFormChange("role", value as Role)}>
                  <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                    {Object.keys(roles).map((role) => (
                      <SelectItem key={role} value={role as Role}>
                        {roles[role as Role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Grade</Label>
                <Select
                  value={individualForm.grade}
                  onValueChange={(value) => handleIndividualFormChange("grade", value as Grade)}>
                  <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                    {Object.keys(grades).map((grade) => (
                      <SelectItem key={grade} value={grade as Grade}>
                        {grades[grade as Grade]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {individualForm.role === "staff" && (
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Subteam</Label>
                <Select
                  value={individualForm.subteam}
                  onValueChange={(value) => handleIndividualFormChange("subteam", value as Subteam)}>
                  <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                    <SelectValue placeholder="Choose subteam" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                    {Object.keys(teams).map((teamOption) => (
                      <SelectItem key={teamOption} value={teamOption as Subteam}>
                        {teams[teamOption as Subteam]}
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
                  onChange={(event) => handleIndividualFormChange("company", event.target.value)}
                  placeholder="Company name"
                  className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">School</Label>
                <Input
                  value={individualForm.school}
                  onChange={(event) => handleIndividualFormChange("school", event.target.value)}
                  placeholder="School name"
                  className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100"
                />
              </div>
            </div>
          </div>
        ) : (
          <label
            htmlFor="people-upload"
            className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 p-6 text-center transition hover:border-sky-500/60">
            <UploadCloud className="h-8 w-8 text-sky-300" />
            {file ? (
              <div>
                <p className="text-sm font-semibold text-white">File: {file.name}</p>
                <p className="text-sm text-slate-400">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-white">Upload CSV/XLSX file</p>
              </div>
            )}
            <input id="people-upload" type="file" className="hidden" accept=".csv,.xlsx" onChange={handleFileUpload} />
          </label>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            disabled={isLocked}
            variant="outline"
            className="rounded-2xl border-slate-700 bg-slate-950/40 text-sm font-semibold text-slate-100 hover:border-sky-500/60"
            onClick={handleRunValidations}>
            Run validations
          </Button>
          <Button
            className="rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400 disabled:opacity-60"
            onClick={handleStageUpload}
            disabled={isLocked}>
            {isUploadLoading ? "Staging..." : "Stage upload"}
          </Button>
        </div>
      </div>
    </section>
  );
}

function RosterViewer({
  loadingState,
  setLoadingState,
  isLocked,
  peopleDataset,
}: {
  loadingState: LoadingState;
  setLoadingState: Dispatch<SetStateAction<LoadingState>>;
  isLocked: boolean;
  peopleDataset: User[];
}) {
  const [subteamFilter, setSubteamFilter] = useState<SubteamFilter>("all");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [accessStatusFilter, setAccessStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [gridPage, setGridPage] = useState(0);

  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
  const [activePersonId, setActivePersonId] = useState<string | null>(null);
  const [modalRole, setModalRole] = useState<Role>("attendee");
  const [modalSubteam, setModalSubteam] = useState<Subteam>(DEFAULT_TEAM);
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>(DEFAULT_COLUMN_VISIBILITY);

  const revokeLoading = loadingState.revoke;
  const applyLoading = loadingState.apply;

  const filteredRoster = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return peopleDataset.filter((person) => {
      if (subteamFilter !== "all") {
        if (person.role !== "staff") {
          return false;
        }
        if (person.subteam !== subteamFilter) {
          return false;
        }
      }
      if (roleFilter !== "all" && person.role !== roleFilter) {
        return false;
      }
      if (accessStatusFilter !== "all" && person.accessStatus !== accessStatusFilter) {
        return false;
      }
      if (normalizedSearch.length > 0) {
        const haystack = `${person.fullName} ${person.email}`.toLowerCase();
        if (!haystack.includes(normalizedSearch)) {
          return false;
        }
      }
      return true;
    });
  }, [subteamFilter, roleFilter, accessStatusFilter, searchQuery]);

  useEffect(() => {
    if (roleFilter !== "staff" && subteamFilter !== "all") {
      setSubteamFilter("all");
    }
  }, [roleFilter, subteamFilter]);

  useEffect(() => {
    setGridPage(0);
  }, [subteamFilter, roleFilter, accessStatusFilter, searchQuery]);

  useEffect(() => {
    const maxPageIndex = Math.max(0, Math.ceil(filteredRoster.length / PAGE_SIZE) - 1);
    setGridPage((prev) => Math.min(prev, maxPageIndex));
  }, [filteredRoster.length]);

  const pagedRoster = filteredRoster.slice(gridPage * PAGE_SIZE, gridPage * PAGE_SIZE + PAGE_SIZE);
  const pageCount = Math.max(1, Math.ceil(filteredRoster.length / PAGE_SIZE));
  const pageStart = filteredRoster.length === 0 ? 0 : gridPage * PAGE_SIZE + 1;
  const pageEnd = Math.min(filteredRoster.length, (gridPage + 1) * PAGE_SIZE);

  const activePerson = useMemo(
    () => peopleDirectory.find((person) => person.uid === activePersonId) ?? null,
    [activePersonId]
  );

  useEffect(() => {
    if (activePerson) {
      setModalRole(activePerson.role as Role);
      if (activePerson.role === "staff") {
        setModalSubteam(activePerson.subteam as Subteam);
      }
    }
  }, [activePerson]);

  const handleOpenDialog = (personId: string) => {
    if (isLocked) {
      return;
    }
    setActivePersonId(personId);
    setAccessDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setAccessDialogOpen(open);
    if (!open) {
      setActivePersonId(null);
    }
  };

  const handlePrevPage = () => {
    setGridPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setGridPage((prev) => Math.min(pageCount - 1, prev + 1));
  };

  const handleRevokeAccess = async () => {
    if (!activePersonId || isLocked) {
      return;
    }
    setLoadingState((prev) => ({ ...prev, revoke: true }));
    try {
      await revokePersonAccess(activePersonId);
    } finally {
      setLoadingState((prev) => ({ ...prev, revoke: false }));
    }
  };

  const handleApplyUpdates = async () => {
    if (!activePersonId || isLocked) {
      return;
    }
    setLoadingState((prev) => ({ ...prev, apply: true }));
    try {
      await applyPersonAccessUpdates(activePersonId, {
        role: modalRole,
        subteam: modalRole === "staff" ? modalSubteam : undefined,
      });
    } finally {
      setLoadingState((prev) => ({ ...prev, apply: false }));
    }
  };
  const handleColumnToggle = (column: keyof ColumnVisibility, checked: boolean) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: checked }));
  };

  return (
    <>
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
            subteamFilter={subteamFilter}
            roleFilter={roleFilter}
            accessStatusFilter={accessStatusFilter}
            searchQuery={searchQuery}
            onSubteamChange={setSubteamFilter}
            onRoleChange={setRoleFilter}
            onAccessStatusChange={setAccessStatusFilter}
            onSearchChange={setSearchQuery}
          />
          <ColumnVisibilityControls visibility={visibleColumns} onToggle={handleColumnToggle} />
          <div className="mt-4">
            {pagedRoster.length > 0 ? (
              <RosterTable
                pagedRoster={pagedRoster}
                onManage={handleOpenDialog}
                visibleColumns={visibleColumns}
                isLocked={isLocked}
              />
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

      <AccessDialog
        open={accessDialogOpen}
        onOpenChange={handleDialogChange}
        activePerson={activePerson}
        modalRole={modalRole}
        onRoleChange={setModalRole}
        modalSubteam={modalSubteam}
        onSubteamChange={setModalSubteam}
        onRevoke={handleRevokeAccess}
        onApply={handleApplyUpdates}
        revokeLoading={revokeLoading}
        applyLoading={applyLoading}
        isLocked={isLocked}
      />
    </>
  );
}

function ExportPanel({
  loadingState,
  setLoadingState,
  isLocked,
}: {
  loadingState: LoadingState;
  setLoadingState: Dispatch<SetStateAction<LoadingState>>;
  isLocked: boolean;
}) {
  const [scope, setScope] = useState<ExportScope>("all");
  const [groupRole, setGroupRole] = useState<Role>("staff");
  const [groupSubteam, setGroupSubteam] = useState<Subteam>(DEFAULT_TEAM);
  const [individualRole, setIndividualRole] = useState<Role>("staff");
  const [individualSubteam, setIndividualSubteam] = useState<Subteam>(DEFAULT_TEAM);
  const [individualPerson, setIndividualPerson] = useState<string | null>(DEFAULT_PERSON?.uid ?? null);
  const [format, setFormat] = useState<ExportFormat>("csv");

  const individualPeople = useMemo(() => {
    return peopleDirectory.filter((person) => {
      if (person.role !== individualRole) {
        return false;
      }
      if (individualRole === "staff" && person.subteam !== individualSubteam) {
        return false;
      }
      return true;
    });
  }, [individualRole, individualSubteam]);

  useEffect(() => {
    if (!individualPeople.some((person) => person.uid === individualPerson)) {
      setIndividualPerson(individualPeople[0]?.uid ?? null);
    }
  }, [individualPeople, individualPerson]);

  const handleGenerate = async () => {
    if (isLocked) {
      return;
    }
    setLoadingState((prev) => ({ ...prev, export: true }));
    try {
      if (scope === "all") {
        await generatePeopleExport({ scope, format });
        return;
      }
      if (scope === "group") {
        await generatePeopleExport({
          scope,
          role: groupRole,
          subteam: groupRole === "staff" ? groupSubteam : undefined,
          format,
        });
        return;
      }
      await generatePeopleExport({
        scope,
        role: individualRole,
        subteam: individualRole === "staff" ? individualSubteam : undefined,
        personId: individualPerson,
        format,
      });
    } finally {
      setLoadingState((prev) => ({ ...prev, export: false }));
    }
  };
  const isExportLoading = loadingState.export;

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
          <Tabs value={scope} onValueChange={(value) => setScope(value as ExportScope)}>
            <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-slate-900/60">
              {EXPORT_SCOPES.map((scope) => (
                <TabsTrigger
                  key={scope}
                  value={scope}
                  className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                  {scope}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="mt-6 space-y-4">
              <TabsContent value="group" className="space-y-3">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Role</Label>
                    <Select value={groupRole} onValueChange={(value) => setGroupRole(value as Role)}>
                      <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                        <SelectValue placeholder="Choose role" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                        {Object.keys(roles).map((role) => (
                          <SelectItem key={role} value={role as Role}>
                            {roles[role as Role]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {groupRole === "staff" && (
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Subteam</Label>
                      <Select value={groupSubteam} onValueChange={(value) => setGroupSubteam(value as Subteam)}>
                        <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                          <SelectValue placeholder="Choose subteam" />
                        </SelectTrigger>
                        <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                          {Object.keys(teams).map((teamOption) => (
                            <SelectItem key={teamOption} value={teamOption as Subteam}>
                              {teams[teamOption as Subteam]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="individual" className="space-y-3">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Role</Label>
                    <Select value={individualRole} onValueChange={(value) => setIndividualRole(value as Role)}>
                      <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                        {Object.keys(roles).map((role) => (
                          <SelectItem key={role} value={role as Role}>
                            {roles[role as Role]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {individualRole === "staff" && (
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Subteam</Label>
                      <Select
                        value={individualSubteam}
                        onValueChange={(value) => setIndividualSubteam(value as Subteam)}>
                        <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                          <SelectValue placeholder="Subteam" />
                        </SelectTrigger>
                        <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                          {Object.keys(teams).map((teamOption) => (
                            <SelectItem key={teamOption} value={teamOption as Subteam}>
                              {teams[teamOption as Subteam]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Person</Label>
                    <Select
                      value={individualPerson ?? undefined}
                      onValueChange={setIndividualPerson}
                      disabled={individualPeople.length === 0}>
                      <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 disabled:opacity-40">
                        <SelectValue placeholder="Person" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                        {individualPeople.length > 0 ? (
                          individualPeople.map((person) => (
                            <SelectItem key={person.uid ?? ""} value={person.uid ?? ""}>
                              {person.fullName}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-people" disabled>
                            No people available
                          </SelectItem>
                        )}
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
            <Select value={format} onValueChange={(value) => setFormat(value as ExportFormat)}>
              <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                <SelectValue placeholder="Choose format" />
              </SelectTrigger>
              <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                {Object.keys(EXPORT_FORMATS).map((format) => (
                  <SelectItem key={format} value={format as ExportFormat}>
                    {EXPORT_FORMATS[format as ExportFormat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400 disabled:opacity-60"
            onClick={handleGenerate}
            disabled={isLocked || (scope === "individual" && !individualPerson)}>
            {isExportLoading ? "Generating..." : `Generate ${EXPORT_FORMATS[format as ExportFormat]}`}
          </Button>
        </div>
      </div>
    </section>
  );
}

function RosterFilters({
  subteamFilter,
  roleFilter,
  accessStatusFilter,
  searchQuery,
  onSubteamChange,
  onRoleChange,
  onAccessStatusChange,
  onSearchChange,
}: {
  subteamFilter: "all" | Subteam;
  roleFilter: "all" | Role;
  accessStatusFilter: "all" | AccessStatus;
  searchQuery: string;
  onSubteamChange: (value: "all" | Subteam) => void;
  onRoleChange: (value: "all" | Role) => void;
  onAccessStatusChange: (value: "all" | AccessStatus) => void;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <Select value={roleFilter} onValueChange={(value) => onRoleChange(value as "all" | Role)}>
        <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
          <SelectValue placeholder="Role filter" />
        </SelectTrigger>
        <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
          <SelectItem value="all">All roles</SelectItem>
          {Object.keys(roles).map((role) => (
            <SelectItem key={role} value={role as Role}>
              {roles[role as Role]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {roleFilter === "staff" && (
        <Select value={subteamFilter} onValueChange={(value) => onSubteamChange(value as "all" | Subteam)}>
          <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
            <SelectValue placeholder="Subteam filter" />
          </SelectTrigger>
          <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
            <SelectItem value="all">All subteams</SelectItem>
            {Object.keys(teams).map((subteam) => (
              <SelectItem key={subteam} value={subteam as Subteam}>
                {teams[subteam as Subteam]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Select value={accessStatusFilter} onValueChange={(value) => onAccessStatusChange(value as "all" | AccessStatus)}>
        <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
          <SelectValue placeholder="Status filter" />
        </SelectTrigger>
        <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
          <SelectItem value="all">All statuses</SelectItem>
          {Object.keys(accessStatuses).map((accessStatus) => (
            <SelectItem key={accessStatus} value={accessStatus as AccessStatus}>
              {accessStatuses[accessStatus as AccessStatus]}
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

function ColumnVisibilityControls({
  visibility,
  onToggle,
}: {
  visibility: ColumnVisibility;
  onToggle: (column: keyof ColumnVisibility, checked: boolean) => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4">
      {COLUMN_CONTROLS.map(({ key, label }) => (
        <label key={key} className="flex items-center gap-2 text-sm text-slate-300">
          <Checkbox
            checked={visibility[key]}
            onCheckedChange={(checked) => onToggle(key, Boolean(checked))}
            className="border-slate-600 data-[state=checked]:border-sky-500 data-[state=checked]:bg-sky-500"
          />
          {label}
        </label>
      ))}
    </div>
  );
}

function RosterTable({
  pagedRoster,
  onManage,
  visibleColumns,
  isLocked,
}: {
  pagedRoster: User[];
  onManage: (uid: string) => void;
  visibleColumns: ColumnVisibility;
  isLocked: boolean;
}) {
  return (
    <Table className="border-collapse text-sm text-slate-200 [&_td]:align-top">
      <TableHeader>
        <TableRow className="bg-slate-900/70 text-xs uppercase tracking-[0.25em] text-slate-500">
          {visibleColumns.person && (
            <TableHead className="min-w-[240px] border border-slate-800/60 bg-slate-950/60 text-slate-400">
              Person
            </TableHead>
          )}
          {visibleColumns.email && <TableHead className="border border-slate-800/60 text-slate-400">Email</TableHead>}
          {visibleColumns.subteam && (
            <TableHead className="border border-slate-800/60 text-slate-400">Subteam</TableHead>
          )}
          {visibleColumns.role && <TableHead className="border border-slate-800/60 text-slate-400">Role</TableHead>}
          {TEXT_COLUMN_CONFIGS.map(
            ({ key, label }) =>
              visibleColumns[key as keyof ColumnVisibility] && (
                <TableHead key={key} className="border border-slate-800/60 text-slate-400">
                  {label}
                </TableHead>
              )
          )}
          {visibleColumns.status && <TableHead className="border border-slate-800/60 text-slate-400">Status</TableHead>}
          {visibleColumns.actions && (
            <TableHead className="border border-slate-800/60 text-right text-slate-400">Actions</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {pagedRoster.map((person) => {
          const subteamLabel = person.role === "staff" ? teams[person.subteam as Subteam] : "—";
          const statusStyle = statusStyles[person.accessStatus as AccessStatus];
          const accessStyle = accessStyles[person.role as Role];
          return (
            <TableRow key={person.uid ?? ""} className="border border-slate-800/60">
              {visibleColumns.person && (
                <TableCell className="border border-slate-800/60 bg-slate-950/40 p-3">
                  <p className="font-semibold text-white">{person.fullName}</p>
                </TableCell>
              )}
              {visibleColumns.email && (
                <TableCell className="border border-slate-800/60 p-3">
                  <p className="text-sm font-medium text-white">{person.email}</p>
                </TableCell>
              )}
              {visibleColumns.subteam && (
                <TableCell className="border border-slate-800/60 p-3">
                  <p className="text-sm font-medium text-white">{subteamLabel}</p>
                </TableCell>
              )}
              {visibleColumns.role && (
                <TableCell className="border border-slate-800/60 p-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={`rounded-full px-3 py-1 text-[0.65rem] ${accessStyle.badge}`}>
                      {accessStyle.label}
                    </Badge>
                  </div>
                </TableCell>
              )}
              {TEXT_COLUMN_CONFIGS.map(
                ({ key, accessor }) =>
                  visibleColumns[key as keyof ColumnVisibility] && (
                    <TableCell key={`${person.uid ?? ""}-${key}`} className="border border-slate-800/60 p-3">
                      <p className="text-sm font-medium text-white">{accessor(person)}</p>
                    </TableCell>
                  )
              )}
              {visibleColumns.status && (
                <TableCell className="border border-slate-800/60 p-3">
                  <div className="space-y-1">
                    <Badge className={`rounded-full px-3 py-1 text-[0.65rem] ${statusStyle.badge}`}>
                      {statusStyle.label}
                    </Badge>
                  </div>
                </TableCell>
              )}
              {visibleColumns.actions && (
                <TableCell className="border border-slate-800/60 p-3 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-slate-700 bg-slate-950/50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100 hover:border-sky-500/60 disabled:opacity-50"
                    onClick={() => onManage(person.uid ?? "")}
                    disabled={isLocked}>
                    Manage
                  </Button>
                </TableCell>
              )}
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
}: {
  pageStart: number;
  pageEnd: number;
  totalCount: number;
  gridPage: number;
  pageCount: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
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

function AccessDialog({
  open,
  onOpenChange,
  activePerson,
  modalRole,
  onRoleChange,
  modalSubteam,
  onSubteamChange,
  onRevoke,
  onApply,
  revokeLoading,
  applyLoading,
  isLocked,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activePerson: User | null;
  modalRole: Role;
  onRoleChange: (role: Role) => void;
  modalSubteam: Subteam | "";
  onSubteamChange: (subteam: Subteam) => void;
  onRevoke: () => void;
  onApply: () => void;
  revokeLoading: boolean;
  applyLoading: boolean;
  isLocked: boolean;
}) {
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
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Role type</Label>
                <Tabs value={modalRole} onValueChange={(value) => onRoleChange(value as Role)}>
                  <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-slate-900/60">
                    {Object.keys(roles).map((role) => (
                      <TabsTrigger
                        key={role}
                        value={role}
                        className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                        {roles[role as Role]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
              {modalRole === "staff" && (
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Subteam</Label>
                  <Select value={modalSubteam} onValueChange={(value) => onSubteamChange(value as Subteam)}>
                    <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                      <SelectValue placeholder="Select subteam" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                      {Object.keys(teams).map((team) => (
                        <SelectItem key={team} value={team as Subteam}>
                          {teams[team as Subteam]}
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
                    className={`rounded-full px-3 py-1 text-[0.65rem] ${
                      statusStyles[activePerson.accessStatus as AccessStatus].badge
                    }`}>
                    {statusStyles[activePerson.accessStatus as AccessStatus].label}
                  </Badge>
                  <Badge
                    className={`rounded-full px-3 py-1 text-[0.65rem] ${
                      accessStyles[activePerson.role as Role].badge
                    }`}>
                    {accessStyles[activePerson.role as Role].label}
                  </Badge>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  {statusStyles[activePerson.accessStatus as AccessStatus].copy}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-rose-500/50 bg-rose-500/10 text-sm font-semibold text-rose-200 hover:border-rose-400 hover:bg-rose-500/20 disabled:opacity-60"
                onClick={onRevoke}
                disabled={isLocked}>
                <ShieldBan className="mr-2 h-4 w-4" />
                {revokeLoading ? "Revoking..." : "Revoke access"}
              </Button>
              <Button
                className="flex-1 rounded-xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400 disabled:opacity-60"
                onClick={onApply}
                disabled={isLocked}>
                <UserMinus2 className="mr-2 h-4 w-4" />
                {applyLoading ? "Applying..." : "Apply updates"}
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
