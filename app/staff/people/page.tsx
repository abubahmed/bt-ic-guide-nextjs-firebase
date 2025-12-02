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
import { teams, peopleDirectory, statusStyles, accessStyles } from "@/app/staff/people/data";

import StaffFooter from "../components/footer";
import StaffHeader from "../components/header";

type UploadScope = "master" | "group" | "individual";
type ExportScope = "master" | "group" | "individual";
type ExportFormat = "csv" | "xlsx";
type AccessRole = "admin" | "staff" | "attendee";
type PersonStatus = "active" | "invited" | "revoked";
type TeamId = (typeof teams)[number]["id"];
type IndividualRole = AccessRole;
type IndividualFormState = {
  fullName: string;
  email: string;
  phone: string;
  role: IndividualRole;
  subteam: TeamId | "";
  grade: string;
  company: string;
  school: string;
};
type PersonRecord = (typeof peopleDirectory)[number] & {
  staffType?: string;
  phone?: string;
  company?: string;
  school?: string;
  grade?: string;
};

const teamLookup = teams.reduce<Record<TeamId, string>>((acc, team) => {
  acc[team.id] = team.label;
  return acc;
}, {} as Record<TeamId, string>);

const DEFAULT_TEAM: TeamId = teams[0].id;
const DEFAULT_PERSON = peopleDirectory.find((person) => person.team === DEFAULT_TEAM)?.id ?? peopleDirectory[0].id;
const PAGE_SIZE = 10;
const ROLE_OPTIONS: AccessRole[] = ["admin", "staff", "attendee"];
const GRADE_OPTIONS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate", "Other"];

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
  visibleColumns: ColumnVisibility;
  isLocked: boolean;
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

type AccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activePerson: PersonRecord | null;
  modalRole: AccessRole;
  onRoleChange: (role: AccessRole) => void;
  modalSubteam: TeamId;
  onSubteamChange: (team: TeamId) => void;
  onRevoke: () => void;
  onApply: () => void;
  revokeLoading: boolean;
  applyLoading: boolean;
  isLocked: boolean;
};

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

type ColumnVisibilityControlsProps = {
  visibility: ColumnVisibility;
  onToggle: (column: keyof ColumnVisibility, checked: boolean) => void;
};

type GlobalLoadingState = {
  fetch: boolean;
  upload: boolean;
  revoke: boolean;
  apply: boolean;
  export: boolean;
};

type UploadPanelProps = {
  loadingState: GlobalLoadingState;
  setLoadingState: Dispatch<SetStateAction<GlobalLoadingState>>;
  isLocked: boolean;
};

type RosterViewerProps = {
  loadingState: GlobalLoadingState;
  setLoadingState: Dispatch<SetStateAction<GlobalLoadingState>>;
  isLocked: boolean;
};

type ExportPanelProps = {
  loadingState: GlobalLoadingState;
  setLoadingState: Dispatch<SetStateAction<GlobalLoadingState>>;
  isLocked: boolean;
};

const TEXT_COLUMN_CONFIGS: Array<{
  key: "phone" | "company" | "school" | "grade";
  label: string;
  accessor: (person: PersonRecord) => string;
}> = [
  {
    key: "phone",
    label: "Phone",
    accessor: (person) => person.phone ?? "—",
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

const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
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

const API_LATENCY_MS = 700;

const simulateNetworkLatency = () => new Promise((resolve) => setTimeout(resolve, API_LATENCY_MS));

async function fetchPeopleDataset(): Promise<{
  teams: typeof teams;
  people: PersonRecord[];
}> {
  await simulateNetworkLatency();
  return {
    teams,
    people: peopleDirectory,
  };
}

async function stageMasterUpload(): Promise<void> {
  await simulateNetworkLatency();
  console.info("[Upload] Master dataset staged");
}

async function stageGroupUpload(role: AccessRole, subteam?: TeamId): Promise<void> {
  await simulateNetworkLatency();
  console.info(`[Upload] Group dataset staged for role=${role} subteam=${subteam ?? "n/a"}`);
}

async function stageIndividualUpload(form: IndividualFormState): Promise<void> {
  await simulateNetworkLatency();
  console.info("[Upload] Individual staged", form);
}

async function revokePersonAccess(personId: string): Promise<void> {
  await simulateNetworkLatency();
  console.info(`[Access] Revoked person=${personId}`);
}

async function applyPersonAccessUpdates(
  personId: string,
  updates: {
    role: AccessRole;
    subteam?: TeamId;
  }
): Promise<void> {
  await simulateNetworkLatency();
  console.info("[Access] Updated person", { personId, updates });
}

async function generatePeopleExport(params: {
  scope: ExportScope;
  role?: AccessRole;
  subteam?: TeamId;
  personId?: string | null;
  format: ExportFormat;
}): Promise<void> {
  await simulateNetworkLatency();
  console.info("[Export] Started generation", params);
}

export default function StaffPeoplePage() {
  const [loadingState, setLoadingState] = useState<GlobalLoadingState>({
    fetch: true,
    upload: false,
    revoke: false,
    apply: false,
    export: false,
  });
  const isGlobalLocked = useMemo(() => Object.values(loadingState).some(Boolean), [loadingState]);

  useEffect(() => {
    let isMounted = true;
    const hydrate = async () => {
      try {
        await fetchPeopleDataset();
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
            <div className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-10 text-center text-sm text-slate-400 shadow-[0px_30px_80px_rgba(2,6,23,0.45)]">
              Loading staff data...
            </div>
          ) : (
            <>
              <UploadPanel loadingState={loadingState} setLoadingState={setLoadingState} isLocked={isGlobalLocked} />
              <RosterViewer loadingState={loadingState} setLoadingState={setLoadingState} isLocked={isGlobalLocked} />
              <ExportPanel loadingState={loadingState} setLoadingState={setLoadingState} isLocked={isGlobalLocked} />
            </>
          )}
        </div>
        <StaffFooter />
      </main>
    </>
  );
}

function UploadPanel({ loadingState, setLoadingState, isLocked }: UploadPanelProps) {
  const [scope, setScope] = useState<UploadScope>("master");
  const [groupRole, setGroupRole] = useState<AccessRole>("staff");
  const [groupSubteam, setGroupSubteam] = useState<TeamId>(DEFAULT_TEAM);
  const [individualForm, setIndividualForm] = useState<IndividualFormState>({
    fullName: "",
    email: "",
    phone: "",
    role: "staff",
    subteam: DEFAULT_TEAM,
    grade: GRADE_OPTIONS[0],
    company: "",
    school: "",
  });

  const handleIndividualFormChange = <K extends keyof IndividualFormState>(field: K, value: IndividualFormState[K]) => {
    setIndividualForm((prev) => {
      if (field === "role") {
        const nextRole = value as IndividualRole;
        return {
          ...prev,
          role: nextRole,
          subteam: nextRole === "staff" ? prev.subteam || DEFAULT_TEAM : "",
        };
      }
      if (field === "subteam") {
        return {
          ...prev,
          subteam: value as TeamId,
        };
      }
      return { ...prev, [field]: value } as IndividualFormState;
    });
  };

  const handleRunValidations = () => {
    if (scope !== "individual") {
      console.info(`[Validations] ${scope} scope currently relies on external spreadsheet validation.`);
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
    if (!individualForm.grade.trim()) {
      errors.push("Grade selection is required.");
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

  const handleStageUpload = async () => {
    if (isLocked) {
      return;
    }
    setLoadingState((prev) => ({ ...prev, upload: true }));
    try {
      if (scope === "master") {
        await stageMasterUpload();
        return;
      }
      if (scope === "group") {
        await stageGroupUpload(groupRole, groupRole === "staff" ? groupSubteam : undefined);
        return;
      }
      await stageIndividualUpload(individualForm);
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
          <Tabs value={scope} onValueChange={(value) => setScope(value as UploadScope)}>
            <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-slate-900/60 text-white">
              <TabsTrigger
                value="master"
                className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                Master
              </TabsTrigger>
              <TabsTrigger
                value="group"
                className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                Group
              </TabsTrigger>
              <TabsTrigger
                value="individual"
                className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                Individual
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {scope === "group" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Role</Label>
              <Select value={groupRole} onValueChange={(value) => setGroupRole(value as AccessRole)}>
                <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                  <SelectValue placeholder="Choose role" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                  {ROLE_OPTIONS.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {groupRole === "staff" && (
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Subteam</Label>
                <Select value={groupSubteam} onValueChange={(value) => setGroupSubteam(value as TeamId)}>
                  <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                    <SelectValue placeholder="Choose subteam" />
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
        )}
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
                  onValueChange={(value) => handleIndividualFormChange("role", value as IndividualRole)}>
                  <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Grade</Label>
                <Select
                  value={individualForm.grade}
                  onValueChange={(value) => handleIndividualFormChange("grade", value)}>
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
                <Select
                  value={individualForm.subteam}
                  onValueChange={(value) => handleIndividualFormChange("subteam", value as TeamId)}>
                  <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                    <SelectValue placeholder="Choose subteam" />
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

function RosterViewer({ loadingState, setLoadingState, isLocked }: RosterViewerProps) {
  const [teamFilter, setTeamFilter] = useState<"all" | TeamId>("all");
  const [accessFilter, setAccessFilter] = useState<"all" | AccessRole>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | PersonStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [gridPage, setGridPage] = useState(0);

  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
  const [activePersonId, setActivePersonId] = useState<string | null>(null);
  const [modalRole, setModalRole] = useState<AccessRole>("attendee");
  const [modalSubteam, setModalSubteam] = useState<TeamId>(DEFAULT_TEAM);
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>(DEFAULT_COLUMN_VISIBILITY);
  const revokeLoading = loadingState.revoke;
  const applyLoading = loadingState.apply;

  const filteredRoster = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return peopleDirectory.filter((person) => {
      if (teamFilter !== "all") {
        if (person.accessRole !== "staff") {
          return false;
        }
        if (person.team !== teamFilter) {
          return false;
        }
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
    if (accessFilter !== "staff" && teamFilter !== "all") {
      setTeamFilter("all");
    }
  }, [accessFilter, teamFilter]);

  useEffect(() => {
    setGridPage(0);
  }, [teamFilter, accessFilter, statusFilter, searchQuery]);

  useEffect(() => {
    const maxPageIndex = Math.max(0, Math.ceil(filteredRoster.length / PAGE_SIZE) - 1);
    setGridPage((prev) => Math.min(prev, maxPageIndex));
  }, [filteredRoster.length]);

  const pagedRoster = filteredRoster.slice(gridPage * PAGE_SIZE, gridPage * PAGE_SIZE + PAGE_SIZE);
  const pageCount = Math.max(1, Math.ceil(filteredRoster.length / PAGE_SIZE));
  const pageStart = filteredRoster.length === 0 ? 0 : gridPage * PAGE_SIZE + 1;
  const pageEnd = Math.min(filteredRoster.length, (gridPage + 1) * PAGE_SIZE);

  const activePerson = useMemo(
    () => peopleDirectory.find((person) => person.id === activePersonId) ?? null,
    [activePersonId]
  );

  useEffect(() => {
    if (activePerson) {
      setModalRole(activePerson.accessRole);
      if (activePerson.accessRole === "staff") {
        setModalSubteam(activePerson.team);
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
            teamFilter={teamFilter}
            accessFilter={accessFilter}
            statusFilter={statusFilter}
            searchQuery={searchQuery}
            onTeamChange={setTeamFilter}
            onAccessChange={setAccessFilter}
            onStatusChange={setStatusFilter}
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

function ExportPanel({ loadingState, setLoadingState, isLocked }: ExportPanelProps) {
  const [scope, setScope] = useState<ExportScope>("master");
  const [groupRole, setGroupRole] = useState<AccessRole>("staff");
  const [groupSubteam, setGroupSubteam] = useState<TeamId>(DEFAULT_TEAM);
  const [individualRole, setIndividualRole] = useState<AccessRole>("staff");
  const [individualSubteam, setIndividualSubteam] = useState<TeamId>(DEFAULT_TEAM);
  const [individualPerson, setIndividualPerson] = useState<string | null>(DEFAULT_PERSON);
  const [format, setFormat] = useState<ExportFormat>("csv");

  const individualPeople = useMemo(() => {
    return peopleDirectory.filter((person) => {
      if (person.accessRole !== individualRole) {
        return false;
      }
      if (individualRole === "staff" && person.team !== individualSubteam) {
        return false;
      }
      return true;
    });
  }, [individualRole, individualSubteam]);

  useEffect(() => {
    if (!individualPeople.some((person) => person.id === individualPerson)) {
      setIndividualPerson(individualPeople[0]?.id ?? null);
    }
  }, [individualPeople, individualPerson]);

  const handleGenerate = async () => {
    if (isLocked) {
      return;
    }
    setLoadingState((prev) => ({ ...prev, export: true }));
    try {
      if (scope === "master") {
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
              <TabsTrigger
                value="master"
                className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                Master
              </TabsTrigger>
              <TabsTrigger
                value="group"
                className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                Group
              </TabsTrigger>
              <TabsTrigger
                value="individual"
                className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                Individual
              </TabsTrigger>
            </TabsList>
            <div className="mt-6 space-y-4">
              <TabsContent value="group" className="space-y-3">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Role</Label>
                    <Select value={groupRole} onValueChange={(value) => setGroupRole(value as AccessRole)}>
                      <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                        <SelectValue placeholder="Choose role" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                        {ROLE_OPTIONS.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {groupRole === "staff" && (
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Subteam</Label>
                      <Select value={groupSubteam} onValueChange={(value) => setGroupSubteam(value as TeamId)}>
                        <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                          <SelectValue placeholder="Choose subteam" />
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
              </TabsContent>
              <TabsContent value="individual" className="space-y-3">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Role</Label>
                    <Select value={individualRole} onValueChange={(value) => setIndividualRole(value as AccessRole)}>
                      <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                        {ROLE_OPTIONS.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
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
                        onValueChange={(value) => setIndividualSubteam(value as TeamId)}>
                        <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                          <SelectValue placeholder="Subteam" />
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
                            <SelectItem key={person.id} value={person.id}>
                              {person.name}
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
                <SelectItem value="csv">CSV (spreadsheet ready)</SelectItem>
                <SelectItem value="xlsx">Excel spreadsheet (.xlsx)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400 disabled:opacity-60"
            onClick={handleGenerate}
            disabled={isLocked || (scope === "individual" && !individualPerson)}>
            {isExportLoading ? "Generating..." : `Generate ${format === "csv" ? "CSV roster" : "XLSX roster"}`}
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
      <Select value={accessFilter} onValueChange={(value) => onAccessChange(value as "all" | AccessRole)}>
        <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
          <SelectValue placeholder="Role filter" />
        </SelectTrigger>
        <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
          <SelectItem value="all">Admins + Staff + Attendees</SelectItem>
          <SelectItem value="admin">Admins</SelectItem>
          <SelectItem value="staff">Staff</SelectItem>
          <SelectItem value="attendee">Attendees</SelectItem>
        </SelectContent>
      </Select>
      {accessFilter === "staff" && (
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
      )}
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

function ColumnVisibilityControls({ visibility, onToggle }: ColumnVisibilityControlsProps) {
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

function RosterTable({ pagedRoster, onManage, visibleColumns, isLocked }: RosterTableProps) {
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
              visibleColumns[key] && (
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
          const subteamLabel = person.accessRole === "staff" ? teamLookup[person.team] : "—";
          const statusStyle = statusStyles[person.status];
          const accessStyle = accessStyles[person.accessRole];
          return (
            <TableRow key={person.id} className="border border-slate-800/60">
              {visibleColumns.person && (
                <TableCell className="border border-slate-800/60 bg-slate-950/40 p-3">
                  <p className="font-semibold text-white">{person.name}</p>
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
                  visibleColumns[key] && (
                    <TableCell key={`${person.id}-${key}`} className="border border-slate-800/60 p-3">
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
                    onClick={() => onManage(person.id)}
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
                  <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-slate-900/60">
                    {ROLE_OPTIONS.map((role) => (
                      <TabsTrigger
                        key={role}
                        value={role}
                        className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
              {modalRole === "staff" && (
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Subteam</Label>
                  <Select value={modalSubteam} onValueChange={(value) => onSubteamChange(value as TeamId)}>
                    <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                      <SelectValue placeholder="Select subteam" />
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
