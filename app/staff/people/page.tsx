"use client";

import { useEffect, useMemo, useState } from "react";

import StaffFooter from "../components/footer";
import StaffHeader from "../components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { gradeOptions, peopleDirectory, roles, subteams } from "@/app/staff/people/data";

type PersonRole = (typeof roles)[number];
type SubteamId = (typeof subteams)[number]["id"];
type GradeValue = (typeof gradeOptions)[number];
type PersonRecord = (typeof peopleDirectory)[number];

type NewPersonState = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  school: string;
  role: PersonRole;
  grade: GradeValue;
  subteam: SubteamId;
};

const PAGE_SIZE = 8;
const subteamLookup = subteams.reduce<Record<SubteamId, string>>((acc, subteam) => {
  acc[subteam.id] = subteam.label;
  return acc;
}, {} as Record<SubteamId, string>);

export default function StaffPeoplePage() {
  const [roleFilter, setRoleFilter] = useState<"all" | PersonRole>("all");
  const [subteamFilter, setSubteamFilter] = useState<"all" | SubteamId>("all");
  const [gradeFilter, setGradeFilter] = useState<"all" | GradeValue>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(0);

  const [newPerson, setNewPerson] = useState<NewPersonState>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    school: "",
    role: roles[0],
    grade: gradeOptions[0],
    subteam: subteams[0].id,
  });

  const filteredRoster = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return peopleDirectory.filter((person) => {
      if (roleFilter !== "all" && person.role !== roleFilter) {
        return false;
      }
      if (subteamFilter !== "all") {
        if (person.role !== "staff") {
          return false;
        }
        if (person.subteam !== subteamFilter) {
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
    setPageIndex(0);
  }, [filteredRoster.length]);

  const pageCount = Math.max(1, Math.ceil(filteredRoster.length / PAGE_SIZE));
  const safePageIndex = Math.min(pageIndex, pageCount - 1);
  const pagedRoster = filteredRoster.slice(safePageIndex * PAGE_SIZE, safePageIndex * PAGE_SIZE + PAGE_SIZE);

  const handleNextPage = () => {
    setPageIndex((prev) => Math.min(prev + 1, pageCount - 1));
  };

  const handlePrevPage = () => {
    setPageIndex((prev) => Math.max(prev - 1, 0));
  };

  const handlePersonChange = <K extends keyof NewPersonState>(field: K, value: NewPersonState[K]) => {
    setNewPerson((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRoleSelect = (value: PersonRole) => {
    setNewPerson((prev) => ({
      ...prev,
      role: value,
      subteam: value === "staff" ? prev.subteam ?? subteams[0].id : prev.subteam,
    }));
  };

  const handleCreatePerson = () => {
    if (!newPerson.fullName.trim() || !newPerson.email.trim() || !newPerson.phone.trim()) {
      return;
    }
    if (newPerson.role === "staff" && !newPerson.subteam) {
      return;
    }

    console.info("Staging person for upload", newPerson);
    setNewPerson({
      fullName: "",
      email: "",
      phone: "",
      company: "",
      school: "",
      role: roles[0],
      grade: gradeOptions[0],
      subteam: subteams[0].id,
    });
  };

  const canSubmit = Boolean(
    newPerson.fullName &&
      newPerson.email &&
      newPerson.phone &&
      newPerson.company &&
      newPerson.school &&
      newPerson.grade &&
      (newPerson.role !== "staff" || !!newPerson.subteam)
  );

  return (
    <main className="min-h-dvh bg-slate-950 text-slate-100">
      <StaffHeader currentPage="people" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
        <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8">
          <div className="space-y-3">
            <div>
              <h1 className="text-3xl font-semibold text-white">People directory</h1>
              <p className="mt-2 text-base text-slate-400">
                Track every attendee, staffer, and admin with consistent structure.
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-wrap gap-3">
              <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as "all" | PersonRole)}>
                <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-44">
                  <SelectValue placeholder="Role" />
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
              <Select
                value={subteamFilter}
                onValueChange={(value) => setSubteamFilter(value as "all" | SubteamId)}
              >
                <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
                  <SelectValue placeholder="Subteam" />
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
              <Select value={gradeFilter} onValueChange={(value) => setGradeFilter(value as "all" | GradeValue)}>
                <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
                  <SelectValue placeholder="Grade" />
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
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search name, email, company, school"
                className="w-full rounded-2xl border-slate-700 bg-slate-950/30 text-slate-100 placeholder:text-slate-500 sm:flex-1"
              />
            </div>
          </div>
          <div className="mt-6 rounded-[28px] border border-slate-800/80 bg-slate-950/50 p-4">
            {pagedRoster.length > 0 ? (
              <PeopleTable pagedRoster={pagedRoster} />
            ) : (
              <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-6 text-center text-sm text-slate-400">
                No people match the applied filters.
              </div>
            )}
            <PaginationControls
              pageIndex={filteredRoster.length === 0 ? 0 : safePageIndex}
              pageCount={filteredRoster.length === 0 ? 0 : pageCount}
              canGoPrev={safePageIndex > 0}
              canGoNext={safePageIndex < pageCount - 1 && filteredRoster.length > 0}
              pageStart={filteredRoster.length === 0 ? 0 : safePageIndex * PAGE_SIZE + 1}
              pageEnd={Math.min(filteredRoster.length, safePageIndex * PAGE_SIZE + pagedRoster.length)}
              totalCount={filteredRoster.length}
              onPrev={handlePrevPage}
              onNext={handleNextPage}
            />
          </div>
        </section>

        <AddPersonForm
          newPerson={newPerson}
          onChange={handlePersonChange}
          onRoleChange={handleRoleSelect}
          onSubmit={handleCreatePerson}
          canSubmit={canSubmit}
        />
      </div>
      <StaffFooter />
    </main>
  );
}

type PeopleTableProps = {
  pagedRoster: PersonRecord[];
};

function PeopleTable({ pagedRoster }: PeopleTableProps) {
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

type PaginationControlsProps = {
  pageIndex: number;
  pageCount: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  pageStart: number;
  pageEnd: number;
  totalCount: number;
  onPrev: () => void;
  onNext: () => void;
};

function PaginationControls({
  pageIndex,
  pageCount,
  canGoPrev,
  canGoNext,
  pageStart,
  pageEnd,
  totalCount,
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
        <span className="text-sm text-slate-300">Page {totalCount === 0 ? 0 : pageIndex + 1} / {totalCount === 0 ? 0 : pageCount}</span>
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

type AddPersonFormProps = {
  newPerson: NewPersonState;
  onChange: <K extends keyof NewPersonState>(field: K, value: NewPersonState[K]) => void;
  onRoleChange: (value: PersonRole) => void;
  onSubmit: () => void;
  canSubmit: boolean;
};

function AddPersonForm({ newPerson, onChange, onRoleChange, onSubmit, canSubmit }: AddPersonFormProps) {
  return (
    <section className="rounded-[32px] border border-slate-800 bg-slate-900/60 p-6 shadow-[0px_30px_60px_rgba(2,6,23,0.45)] lg:p-8">
      <div className="space-y-3">
        <div>
          <h2 className="text-2xl font-semibold text-white">Create individual record</h2>
          <p className="text-slate-400">Capture the essentials for a new attendee, staffer, or admin.</p>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Full name</Label>
            <Input
              value={newPerson.fullName}
              onChange={(event) => onChange("fullName", event.target.value)}
              placeholder="Alex Chen"
              className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Email</Label>
            <Input
              type="email"
              value={newPerson.email}
              onChange={(event) => onChange("email", event.target.value)}
              placeholder="alex@example.com"
              className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100"
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Phone</Label>
            <Input
              value={newPerson.phone}
              onChange={(event) => onChange("phone", event.target.value)}
              placeholder="+1 (555) 123-4567"
              className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Role</Label>
            <Select value={newPerson.role} onValueChange={(value) => onRoleChange(value as PersonRole)}>
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
            <Select value={newPerson.grade} onValueChange={(value) => onChange("grade", value as GradeValue)}>
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
        {newPerson.role === "staff" && (
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Subteam</Label>
            <Select value={newPerson.subteam} onValueChange={(value) => onChange("subteam", value as SubteamId)}>
              <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                <SelectValue placeholder="Select subteam" />
              </SelectTrigger>
              <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                {subteams.map((subteam) => (
                  <SelectItem key={subteam.id} value={subteam.id}>
                    {subteam.label}
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
              value={newPerson.company}
              onChange={(event) => onChange("company", event.target.value)}
              placeholder="BTIC"
              className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">School</Label>
            <Input
              value={newPerson.school}
              onChange={(event) => onChange("school", event.target.value)}
              placeholder="University"
              className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-2xl border-slate-700 bg-slate-950/40 text-sm font-semibold text-slate-100 hover:border-sky-500/60"
            disabled={!canSubmit}
            onClick={onSubmit}
          >
            Stage individual record
          </Button>
        </div>
      </div>
    </section>
  );
}
