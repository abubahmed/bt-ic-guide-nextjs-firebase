"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { DownloadCloud, Filter, FolderPlus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import StaffFooter from "../(dashboard)/components/footer";
import StaffHeader from "../(dashboard)/components/header";

type Visibility = "staff" | "attendees" | "both";
type SourceType = "link" | "file";

type ResourceEntry = {
  id: string;
  title: string;
  description: string;
  owner: string;
  visibility: Visibility;
  updated: string;
  size: string;
  sourceType: SourceType;
  reference: string;
};

const seededResources: ResourceEntry[] = [
  {
    id: "res-001",
    title: "Command deck handoff guide",
    description: "Checklist for opening/closing the ops deck with badge protocols.",
    owner: "Jordan King",
    visibility: "staff",
    updated: "Today · 09:12 AM",
    size: "2.1 MB",
    sourceType: "file",
    reference: "Command_Deck_Handoff.pdf",
  },
  {
    id: "res-002",
    title: "Programming run of show",
    description: "Session timings, cues, and presenter bios for Day 2.",
    owner: "Maya Patel",
    visibility: "both",
    updated: "Today · 08:40 AM",
    size: "Spreadsheet",
    sourceType: "link",
    reference: "https://btic.app/ros/day-2",
  },
  {
    id: "res-003",
    title: "Hospitality suite checklist",
    description: "Stocking requirements + VIP notes for suites 901-905.",
    owner: "Leo Carter",
    visibility: "staff",
    updated: "Today · 08:00 AM",
    size: "210 KB",
    sourceType: "file",
    reference: "Hospitality_Suite_Checklist.docx",
  },
  {
    id: "res-004",
    title: "Incident escalation form",
    description: "Quick form for on-site issues needing exec escalation.",
    owner: "Diana Park",
    visibility: "both",
    updated: "Today · 07:45 AM",
    size: "Web",
    sourceType: "link",
    reference: "https://forms.btic.app/escalations",
  },
  {
    id: "res-005",
    title: "Attendee reimbursements",
    description: "Expense policy and submission instructions for attendees.",
    owner: "Priya Iyer",
    visibility: "attendees",
    updated: "Yesterday · 09:32 PM",
    size: "1.3 MB",
    sourceType: "file",
    reference: "Attendee_Reimbursements.pdf",
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
  both: {
    label: "Staff + attendee",
    badge: "border border-amber-500/40 bg-amber-500/10 text-amber-200",
  },
};

const sourceStyles: Record<SourceType, { label: string; badge: string }> = {
  link: {
    label: "URL",
    badge: "border border-sky-400/40 bg-sky-400/10 text-sky-100",
  },
  file: {
    label: "File",
    badge: "border border-slate-500/50 bg-slate-500/10 text-slate-100",
  },
};

const PAGE_SIZE = 6;

export default function StaffResourcesPage() {
  const [entries, setEntries] = useState<ResourceEntry[]>(seededResources);

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formVisibility, setFormVisibility] = useState<Visibility>("staff");
  const [uploadMode, setUploadMode] = useState<SourceType>("link");
  const [formLink, setFormLink] = useState("");
  const [formFile, setFormFile] = useState<File | null>(null);

  const [visibilityFilter, setVisibilityFilter] = useState<"all" | Visibility>("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | SourceType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [gridPage, setGridPage] = useState(0);

  const counters = useMemo(() => {
    const staffOnly = entries.filter((entry) => entry.visibility === "staff").length;
    const attendeeFacing = entries.filter((entry) => entry.visibility === "attendees").length;
    const both = entries.filter((entry) => entry.visibility === "both").length;
    return { staffOnly, attendeeFacing, both };
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return entries.filter((entry) => {
      if (visibilityFilter !== "all" && entry.visibility !== visibilityFilter) {
        return false;
      }
      if (sourceFilter !== "all" && entry.sourceType !== sourceFilter) {
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
  }, [entries, visibilityFilter, sourceFilter, searchQuery]);

  useEffect(() => {
    setGridPage(0);
  }, [visibilityFilter, sourceFilter, searchQuery]);

  const pageCount = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));
  const pagedEntries = filteredEntries.slice(gridPage * PAGE_SIZE, gridPage * PAGE_SIZE + PAGE_SIZE);
  const pageStart = filteredEntries.length === 0 ? 0 : gridPage * PAGE_SIZE + 1;
  const pageEnd = Math.min(filteredEntries.length, (gridPage + 1) * PAGE_SIZE);

  const resetUploadFields = (nextMode: SourceType) => {
    setUploadMode(nextMode);
    setFormLink("");
    setFormFile(null);
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFormFile(file ?? null);
  };

  const handleSubmit = () => {
    if (!formTitle.trim()) {
      return;
    }
    if (uploadMode === "link" && !formLink.trim()) {
      return;
    }
    if (uploadMode === "file" && !formFile) {
      return;
    }

    const sizeLabel =
      uploadMode === "file" && formFile
        ? formFile.size >= 1024 * 1024
          ? `${(formFile.size / (1024 * 1024)).toFixed(2)} MB`
          : `${Math.max(0.1, formFile.size / 1024).toFixed(1)} KB`
        : "External link";

    const referenceLabel =
      uploadMode === "link" ? formLink.trim() : formFile?.name ?? "Attachment";

    const newEntry: ResourceEntry = {
      id: `res-${Date.now()}`,
      title: formTitle.trim(),
      description: formDescription.trim() || "Description pending",
      owner: "You",
      visibility: formVisibility,
      updated: "Scheduled · Ready after upload",
      size: sizeLabel,
      sourceType: uploadMode,
      reference: referenceLabel,
    };

    setEntries((prev) => [newEntry, ...prev]);
    setFormTitle("");
    setFormDescription("");
    setFormLink("");
    setFormFile(null);
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
                  Drop a link or attach a file—never both at once—then tag which audiences can see it before we stage it
                  in the shared vault.
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
                <p className="text-3xl font-semibold text-white">{counters.both}</p>
                <p>Shared</p>
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
                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Provide access via</Label>
                  <Tabs value={uploadMode} onValueChange={(value) => resetUploadFields(value as SourceType)}>
                    <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-slate-900/60">
                      <TabsTrigger
                        value="link"
                        className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                        URL link
                      </TabsTrigger>
                      <TabsTrigger
                        value="file"
                        className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                        File upload
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  {uploadMode === "link" ? (
                    <Input
                      value={formLink}
                      onChange={(event) => setFormLink(event.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 placeholder:text-slate-500"
                    />
                  ) : (
                    <label
                      htmlFor="resource-file"
                      className="flex cursor-pointer flex-col gap-2 rounded-2xl border border-dashed border-slate-700 bg-slate-950/20 px-4 py-5 text-center text-sm text-slate-300">
                      <span className="font-semibold text-white">
                        {formFile ? formFile.name : "Attach file from device"}
                      </span>
                      <span className="text-xs text-slate-500">
                        PDF, DOCX, PPTX, or XLSX · Max 25 MB · Stored in shared drive
                      </span>
                      <input id="resource-file" type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                  )}
                  <p className="text-xs text-slate-500">
                    Only one source per resource. Switching between URL and file will clear the other option.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
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
                        value="both"
                        className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                        Both
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4 text-sm text-slate-400">
                  <p className="font-semibold text-white">Who can see this?</p>
                  <p className="mt-1">
                    Staff visibility keeps it internal. Attendee visibility publishes to the guest portal. Both mirrors
                    across surfaces with read-only controls.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    className="rounded-2xl border-slate-700 bg-slate-950/40 text-sm font-semibold text-slate-100 hover:border-sky-500/60">
                    Validate metadata
                  </Button>
                  <Button
                    className="rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400"
                    onClick={handleSubmit}>
                    <DownloadCloud className="mr-2 h-4 w-4" />
                    Stage resource
                  </Button>
                </div>
              </div>
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
                  Filter by audience or source type, search across titles, then prune outdated uploads so everyone works
                  from one source of truth.
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
              <Select value={visibilityFilter} onValueChange={(value) => setVisibilityFilter(value as "all" | Visibility)}>
                <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
                  <SelectValue placeholder="Visibility filter" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                  <SelectItem value="all">Staff + Attendee</SelectItem>
                  <SelectItem value="staff">Staff only</SelectItem>
                  <SelectItem value="attendees">Attendee facing</SelectItem>
                  <SelectItem value="both">Shared</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={(value) => setSourceFilter(value as "all" | SourceType)}>
                <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
                  <SelectValue placeholder="Source type" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                  <SelectItem value="all">Link + File</SelectItem>
                  <SelectItem value="link">Links</SelectItem>
                  <SelectItem value="file">Files</SelectItem>
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
                      <TableHead className="border border-slate-800/60 text-slate-400">Owner</TableHead>
                      <TableHead className="border border-slate-800/60 text-slate-400">Visibility · Updated</TableHead>
                      <TableHead className="border border-slate-800/60 text-slate-400">Source · Size</TableHead>
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
                          <p className="text-sm font-medium text-white">{entry.owner}</p>
                          <p className="text-xs text-slate-500">
                            {entry.sourceType === "link" ? "Owner-hosted link" : "Drive upload"}
                          </p>
                        </TableCell>
                        <TableCell className="border border-slate-800/60 p-3">
                          <div className="flex flex-wrap gap-2">
                            <Badge className={`rounded-full px-3 py-1 text-[0.65rem] ${visibilityStyles[entry.visibility].badge}`}>
                              {visibilityStyles[entry.visibility].label}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400">{entry.updated}</p>
                        </TableCell>
                        <TableCell className="border border-slate-800/60 p-3">
                          <div className="flex flex-wrap gap-2">
                            <Badge className={`rounded-full px-3 py-1 text-[0.65rem] ${sourceStyles[entry.sourceType].badge}`}>
                              {sourceStyles[entry.sourceType].label}
                            </Badge>
                          </div>
                          {entry.sourceType === "link" ? (
                            <a
                              href={entry.reference}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-sky-300 underline underline-offset-2">
                              {entry.reference}
                            </a>
                          ) : (
                            <p className="text-xs text-slate-300">{entry.reference}</p>
                          )}
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
