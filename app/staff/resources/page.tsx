"use client";

import { useEffect, useMemo, useState } from "react";
import { DownloadCloud, Filter, FolderPlus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import StaffFooter from "../(dashboard)/components/footer";
import StaffHeader from "../(dashboard)/components/header";

const teams = [
  { id: "all", label: "All-hands" },
  { id: "operations", label: "Operations" },
  { id: "programming", label: "Programming" },
  { id: "hospitality", label: "Hospitality" },
  { id: "security", label: "Security" },
  { id: "logistics", label: "Logistics" },
] as const;

const resourceTypes = [
  { id: "guide", label: "Guide" },
  { id: "template", label: "Template" },
  { id: "form", label: "Form" },
  { id: "deck", label: "Deck" },
  { id: "report", label: "Report" },
] as const;

const formats = [
  { id: "pdf", label: "PDF" },
  { id: "sheet", label: "Sheet" },
  { id: "doc", label: "Doc" },
  { id: "link", label: "Link" },
] as const;

type TeamId = (typeof teams)[number]["id"];
type ResourceTypeId = (typeof resourceTypes)[number]["id"];
type FormatId = (typeof formats)[number]["id"];
type Visibility = "staff" | "attendees" | "hybrid";

type ResourceEntry = {
  id: string;
  title: string;
  description: string;
  type: ResourceTypeId;
  format: FormatId;
  owner: string;
  team: TeamId;
  visibility: Visibility;
  updated: string;
  size: string;
};

const resourceTypeLookup = resourceTypes.reduce<Record<ResourceTypeId, string>>((acc, type) => {
  acc[type.id] = type.label;
  return acc;
}, {} as Record<ResourceTypeId, string>);

const formatLookup = formats.reduce<Record<FormatId, string>>((acc, format) => {
  acc[format.id] = format.label;
  return acc;
}, {} as Record<FormatId, string>);

const teamLookup = teams.reduce<Record<TeamId, string>>((acc, team) => {
  acc[team.id] = team.label;
  return acc;
}, {} as Record<TeamId, string>);

const seededResources: ResourceEntry[] = [
  {
    id: "res-001",
    title: "Command deck handoff guide",
    description: "Checklist for opening/closing the ops deck with badge protocols.",
    type: "guide",
    format: "pdf",
    owner: "Jordan King",
    team: "operations",
    visibility: "staff",
    updated: "Today · 09:12 AM",
    size: "2.1 MB",
  },
  {
    id: "res-002",
    title: "Programming run of show",
    description: "Session timings, cues, and presenter bios for Day 2.",
    type: "report",
    format: "sheet",
    owner: "Maya Patel",
    team: "programming",
    visibility: "hybrid",
    updated: "Today · 08:40 AM",
    size: "Spreadsheet",
  },
  {
    id: "res-003",
    title: "Hospitality suite checklist",
    description: "Stocking requirements + VIP notes for suites 901-905.",
    type: "template",
    format: "doc",
    owner: "Leo Carter",
    team: "hospitality",
    visibility: "staff",
    updated: "Today · 08:00 AM",
    size: "210 KB",
  },
  {
    id: "res-004",
    title: "Incident escalation form",
    description: "Quick form for on-site issues needing exec escalation.",
    type: "form",
    format: "link",
    owner: "Diana Park",
    team: "security",
    visibility: "hybrid",
    updated: "Today · 07:45 AM",
    size: "Web",
  },
  {
    id: "res-005",
    title: "Attendee reimbursements",
    description: "Expense policy and submission instructions for attendees.",
    type: "guide",
    format: "pdf",
    owner: "Priya Iyer",
    team: "all",
    visibility: "attendees",
    updated: "Yesterday · 09:32 PM",
    size: "1.3 MB",
  },
  {
    id: "res-006",
    title: "Logistics fleet tracker",
    description: "Vehicle manifests + shuttle rotation plan.",
    type: "report",
    format: "sheet",
    owner: "Opal Reed",
    team: "logistics",
    visibility: "staff",
    updated: "Today · 06:58 AM",
    size: "Spreadsheet",
  },
] as const;

const visibilityStyles: Record<Visibility, { label: string; badge: string }> = {
  staff: {
    label: "Staff only",
    badge: "border border-sky-500/40 bg-sky-500/10 text-sky-200",
  },
  attendees: {
    label: "Attendee facing",
    badge: "border border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  },
  hybrid: {
    label: "Staff + attendee",
    badge: "border border-amber-500/40 bg-amber-500/10 text-amber-200",
  },
};

const PAGE_SIZE = 6;

export default function StaffResourcesPage() {
  const [entries, setEntries] = useState<ResourceEntry[]>(seededResources);

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState<ResourceTypeId>("guide");
  const [formFormat, setFormFormat] = useState<FormatId>("pdf");
  const [formVisibility, setFormVisibility] = useState<Visibility>("staff");
  const [formTeam, setFormTeam] = useState<TeamId>("operations");
  const [formLink, setFormLink] = useState("");

  const [typeFilter, setTypeFilter] = useState<"all" | ResourceTypeId>("all");
  const [formatFilter, setFormatFilter] = useState<"all" | FormatId>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | Visibility>("all");
  const [teamFilter, setTeamFilter] = useState<"all" | TeamId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [gridPage, setGridPage] = useState(0);

  const counters = useMemo(() => {
    const staffOnly = entries.filter((entry) => entry.visibility === "staff").length;
    const attendeeFacing = entries.filter((entry) => entry.visibility === "attendees").length;
    const hybrid = entries.filter((entry) => entry.visibility === "hybrid").length;
    return { staffOnly, attendeeFacing, hybrid };
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return entries.filter((entry) => {
      if (typeFilter !== "all" && entry.type !== typeFilter) {
        return false;
      }
      if (formatFilter !== "all" && entry.format !== formatFilter) {
        return false;
      }
      if (visibilityFilter !== "all" && entry.visibility !== visibilityFilter) {
        return false;
      }
      if (teamFilter !== "all" && entry.team !== teamFilter) {
        return false;
      }
      if (normalizedSearch.length > 0) {
        const haystack = `${entry.title} ${entry.description} ${entry.owner}`.toLowerCase();
        if (!haystack.includes(normalizedSearch)) {
          return false;
        }
      }
      return true;
    });
  }, [entries, typeFilter, formatFilter, visibilityFilter, teamFilter, searchQuery]);

  useEffect(() => {
    setGridPage(0);
  }, [typeFilter, formatFilter, visibilityFilter, teamFilter, searchQuery]);

  const pageCount = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));
  const pagedEntries = filteredEntries.slice(gridPage * PAGE_SIZE, gridPage * PAGE_SIZE + PAGE_SIZE);
  const pageStart = filteredEntries.length === 0 ? 0 : gridPage * PAGE_SIZE + 1;
  const pageEnd = Math.min(filteredEntries.length, (gridPage + 1) * PAGE_SIZE);

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleSubmit = () => {
    const newEntry: ResourceEntry = {
      id: `res-${Date.now()}`,
      title: formTitle || "Untitled resource",
      description: formDescription || "Description pending",
      type: formType,
      format: formFormat,
      owner: "You",
      team: formTeam,
      visibility: formVisibility,
      updated: "Scheduled · Ready after upload",
      size: formFormat === "sheet" ? "Spreadsheet" : formFormat === "link" ? "Web" : "Pending size",
    };
    setEntries((prev) => [newEntry, ...prev]);
    setFormTitle("");
    setFormDescription("");
    setFormLink("");
  };

  return (
    <main className="min-h-dvh bg-slate-950 text-slate-100">
      <StaffHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
        <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-sky-400">
                <span>Resource vault</span>
                <span className="h-px w-8 bg-slate-800" />
                <span>Guides · Forms · Templates</span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-white">Upload reference materials and forms</h1>
                <p className="mt-2 max-w-3xl text-base text-slate-400">
                  Keep every checklist, brief, or attendee-facing policy in one workspace. Gate content to staff-only or
                  make it shareable with attendees when needed.
                </p>
              </div>
            </div>
            <div className="grid gap-3 text-center text-xs uppercase tracking-[0.35em] text-slate-500 sm:grid-cols-3 lg:text-right">
              <div className="rounded-3xl border border-slate-800/70 bg-slate-950/50 px-4 py-3 text-slate-400">
                <p className="text-3xl font-semibold text-white">{counters.staffOnly}</p>
                <p>Staff only</p>
              </div>
              <div className="rounded-3xl border border-slate-800/70 bg-slate-950/50 px-4 py-3 text-slate-400">
                <p className="text-3xl font-semibold text-white">{counters.attendeeFacing}</p>
                <p>Attendee</p>
              </div>
              <div className="rounded-3xl border border-slate-800/70 bg-slate-950/50 px-4 py-3 text-slate-400">
                <p className="text-3xl font-semibold text-white">{counters.hybrid}</p>
                <p>Hybrid</p>
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-[28px] border border-slate-800/70 bg-slate-950/50 p-6">
            <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">
              <FolderPlus className="h-4 w-4 text-sky-300" />
              <span>Upload new resource</span>
            </div>
            <div className="mt-4 grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Title</Label>
                  <Input
                    value={formTitle}
                    onChange={(event) => setFormTitle(event.target.value)}
                    placeholder="e.g., Incident escalation form"
                    className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Description</Label>
                  <Textarea
                    value={formDescription}
                    onChange={(event) => setFormDescription(event.target.value)}
                    placeholder="Summarize when or how to use this resource..."
                    className="min-h-[120px] rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Link or file reference</Label>
                  <Input
                    value={formLink}
                    onChange={(event) => setFormLink(event.target.value)}
                    placeholder="Paste URL or internal storage path"
                    className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Resource type</Label>
                    <Select value={formType} onValueChange={(value) => setFormType(value as ResourceTypeId)}>
                      <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                        {resourceTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Format</Label>
                    <Select value={formFormat} onValueChange={(value) => setFormFormat(value as FormatId)}>
                      <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                        <SelectValue placeholder="Format" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                        {formats.map((format) => (
                          <SelectItem key={format.id} value={format.id}>
                            {format.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Visibility</Label>
                    <Tabs value={formVisibility} onValueChange={(value) => setFormVisibility(value as Visibility)}>
                      <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-slate-900/60">
                        <TabsTrigger
                          value="staff"
                          className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                          Staff
                        </TabsTrigger>
                        <TabsTrigger
                          value="attendees"
                          className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                          Attendees
                        </TabsTrigger>
                        <TabsTrigger
                          value="hybrid"
                          className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                          Hybrid
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="staff" className="sr-only" />
                      <TabsContent value="attendees" className="sr-only" />
                      <TabsContent value="hybrid" className="sr-only" />
                    </Tabs>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Team ownership</Label>
                    <Select value={formTeam} onValueChange={(value) => setFormTeam(value as TeamId)}>
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
                </div>
                <p className="text-xs text-slate-500">
                  Uploaded files store in the shared BTIC drive; hybrid visibility exposes a read-only attendee version.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-2xl border-slate-700 bg-slate-950/40 text-sm font-semibold text-slate-100 hover:border-sky-500/60">
                Validate metadata
              </Button>
              <Button
                className="flex-1 rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400"
                onClick={handleSubmit}>
                <DownloadCloud className="mr-2 h-4 w-4" />
                Stage resource
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-sky-400">
                <span>Resource directory</span>
                <span className="h-px w-8 bg-slate-800" />
                <span>Filter · Search · Delete</span>
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-white">All published PDFs, decks, and forms</h2>
                <p className="mt-2 max-w-3xl text-base text-slate-400">
                  Filter by type, format, or audience. Remove duplicates when a new revision is uploaded so staff have
                  one source of truth.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-800/70 bg-slate-950/40 px-4 py-3 text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">
              <Filter className="h-4 w-4 text-sky-300" />
              <span>{filteredEntries.length} items visible</span>
            </div>
          </div>
          <div className="mt-6 rounded-[28px] border border-slate-800/80 bg-slate-950/50 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as "all" | ResourceTypeId)}>
                <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
                  <SelectValue placeholder="Type filter" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                  <SelectItem value="all">All types</SelectItem>
                  {resourceTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={formatFilter} onValueChange={(value) => setFormatFilter(value as "all" | FormatId)}>
                <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
                  <SelectValue placeholder="Format filter" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                  <SelectItem value="all">All formats</SelectItem>
                  {formats.map((format) => (
                    <SelectItem key={format.id} value={format.id}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={visibilityFilter}
                onValueChange={(value) => setVisibilityFilter(value as "all" | Visibility)}>
                <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
                  <SelectValue placeholder="Visibility filter" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                  <SelectItem value="all">Staff + Attendee</SelectItem>
                  <SelectItem value="staff">Staff only</SelectItem>
                  <SelectItem value="attendees">Attendee facing</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
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
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search title, owner, or note"
                className="w-full rounded-2xl border-slate-700 bg-slate-950/30 text-slate-100 placeholder:text-slate-500 sm:w-64"
              />
            </div>
            <div className="mt-4">
              {pagedEntries.length > 0 ? (
                <Table className="text-sm text-slate-200 border-collapse [&_td]:align-top">
                  <TableHeader>
                    <TableRow className="bg-slate-900/70 text-xs uppercase tracking-[0.25em] text-slate-500">
                      <TableHead className="min-w-[240px] border border-slate-800/60 bg-slate-950/60 text-slate-400">
                        Title · Description
                      </TableHead>
                      <TableHead className="border border-slate-800/60 text-slate-400">Type · Format</TableHead>
                      <TableHead className="border border-slate-800/60 text-slate-400">Owner · Team</TableHead>
                      <TableHead className="border border-slate-800/60 text-slate-400">Visibility · Updated</TableHead>
                      <TableHead className="border border-slate-800/60 text-right text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedEntries.map((entry) => (
                      <TableRow key={entry.id} className="border border-slate-800/60">
                        <TableCell className="border border-slate-800/60 bg-slate-950/40 p-3">
                          <p className="font-semibold text-white">{entry.title}</p>
                          <p className="text-xs text-slate-500">{entry.description}</p>
                        </TableCell>
                        <TableCell className="border border-slate-800/60 p-3">
                          <div className="flex flex-wrap gap-2">
                            <Badge className="rounded-full border border-slate-700 bg-slate-950/60 text-[0.65rem] text-slate-200">
                              {resourceTypeLookup[entry.type]}
                            </Badge>
                            <Badge className="rounded-full border border-slate-700 bg-slate-950/60 text-[0.65rem] text-slate-200">
                              {formatLookup[entry.format]}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="border border-slate-800/60 p-3">
                          <p className="text-sm font-medium text-white">{entry.owner}</p>
                          <p className="text-xs text-slate-500">{teamLookup[entry.team]}</p>
                        </TableCell>
                        <TableCell className="border border-slate-800/60 p-3">
                          <div className="flex flex-wrap gap-2">
                            <Badge className={`rounded-full px-3 py-1 text-[0.65rem] ${visibilityStyles[entry.visibility].badge}`}>
                              {visibilityStyles[entry.visibility].label}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400">{entry.updated}</p>
                          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">{entry.size}</p>
                        </TableCell>
                        <TableCell className="border border-slate-800/60 p-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-slate-700 bg-slate-950/50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100 hover:border-rose-500/60"
                            onClick={() => handleDelete(entry.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-6 text-center text-sm text-slate-400">
                  No resources match the current filters.
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <p>
                {filteredEntries.length === 0
                  ? "No resources to display."
                  : `Showing ${pageStart}–${pageEnd} of ${filteredEntries.length} resources`}
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
                  Page {filteredEntries.length === 0 ? 0 : gridPage + 1} / {filteredEntries.length === 0 ? 0 : pageCount}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={gridPage >= pageCount - 1 || filteredEntries.length === 0}
                  className="rounded-xl border-slate-700 bg-slate-950/50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100 disabled:opacity-30"
                  onClick={() => setGridPage((prev) => Math.min(pageCount - 1, prev + 1))}>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <StaffFooter />
    </main>
  );
}
