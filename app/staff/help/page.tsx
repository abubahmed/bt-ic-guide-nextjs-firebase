"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Filter, LifeBuoy, MessageSquare } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import StaffFooter from "../components/footer";
import StaffHeader from "../components/header";

import { teams, helpTypes, helpRequests, statusStyles, priorityStyles } from "./data";

type HelpRequestType = (typeof helpTypes)[number]["id"];
type HelpRequestStatus = "new" | "pending" | "in-progress" | "solved" | "failed";

type HelpRequest = {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterRole: string;
  channel: string;
  ownerTeam: (typeof teams)[number]["id"];
  requestType: HelpRequestType;
  summary: string;
  detail: string;
  submittedAt: string;
  priority: "low" | "medium" | "high";
  status: HelpRequestStatus;
};

const PAGE_SIZE = 6;

const requesterDirectory = helpRequests.reduce<Record<string, { label: string; team: HelpRequest["ownerTeam"] }>>(
  (acc, request) => {
    acc[request.requesterId] = { label: request.requesterName, team: request.ownerTeam as any };
    return acc;
  },
  {}
);

export default function StaffHelpPage() {
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [requesterFilter, setRequesterFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [activeRequest, setActiveRequest] = useState<HelpRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusDraft, setStatusDraft] = useState<HelpRequestStatus>("new");

  useEffect(() => {
    if (activeRequest) {
      setStatusDraft(activeRequest.status);
    }
  }, [activeRequest]);

  useEffect(() => {
    if (requesterFilter === "all") {
      return;
    }

    const requester = requesterDirectory[requesterFilter];
    if (!requester || (teamFilter !== "all" && requester.team !== teamFilter)) {
      setRequesterFilter("all");
    }
  }, [teamFilter, requesterFilter]);

  const visibleRequesters = useMemo(() => {
    return Object.entries(requesterDirectory)
      .filter(([_, meta]) => (teamFilter === "all" ? true : meta.team === teamFilter))
      .map(([id, meta]) => ({ id, label: meta.label }));
  }, [teamFilter]);

  const filteredRequests = useMemo(() => {
    return helpRequests.filter((request) => {
      const matchesTeam = teamFilter === "all" || request.ownerTeam === teamFilter;
      const matchesRequester = requesterFilter === "all" || request.requesterId === requesterFilter;
      const matchesType = typeFilter === "all" || request.requestType === typeFilter;
      return matchesTeam && matchesRequester && matchesType;
    });
  }, [teamFilter, requesterFilter, typeFilter]);

  useEffect(() => {
    setPage(0);
  }, [teamFilter, requesterFilter, typeFilter]);

  useEffect(() => {
    const maxPageIndex = Math.max(0, Math.ceil(filteredRequests.length / PAGE_SIZE) - 1);
    setPage((prev) => Math.min(prev, maxPageIndex));
  }, [filteredRequests.length]);

  const pageCount = Math.max(1, Math.ceil(filteredRequests.length / PAGE_SIZE));
  const paginatedRequests = filteredRequests.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const pageStart = filteredRequests.length === 0 ? 0 : page * PAGE_SIZE + 1;
  const pageEnd = Math.min(filteredRequests.length, (page + 1) * PAGE_SIZE);

  const handleOpenRequest = (request: HelpRequest) => {
    setActiveRequest(request);
    setDialogOpen(true);
  };

  return (
    <main className="min-h-dvh bg-slate-950 text-slate-100">
      <StaffHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
        <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div>
                <h1 className="text-3xl font-semibold text-white">View and manage help requests</h1>
                <p className="mt-2 max-w-3xl text-base text-slate-400">
                  Track help requests from all teams and individuals. Click any row to view full context, add notes, or
                  update disposition.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-[28px] border border-slate-800/80 bg-slate-950/50 p-4">
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Select value={teamFilter} onValueChange={setTeamFilter}>
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
              <Select value={requesterFilter} onValueChange={setRequesterFilter}>
                <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-56">
                  <SelectValue placeholder="Individual filter" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                  <SelectItem value="all">All requesters</SelectItem>
                  {visibleRequesters.map((requester) => (
                    <SelectItem key={requester.id} value={requester.id}>
                      {requester.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-56">
                  <SelectValue placeholder="Help type" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                  <SelectItem value="all">All request types</SelectItem>
                  {helpTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4">
              {paginatedRequests.length > 0 ? (
                <Table className="text-sm text-slate-200 border-collapse [&_td]:align-top">
                  <TableHeader>
                    <TableRow className="bg-slate-900/70 text-xs uppercase tracking-[0.25em] text-slate-500">
                      <TableHead className="min-w-[220px] border border-slate-800/60 bg-slate-950/60 text-slate-400">
                        Requester · Channel
                      </TableHead>
                      <TableHead className="border border-slate-800/60 bg-slate-950/60 text-slate-400">Team</TableHead>
                      <TableHead className="border border-slate-800/60 bg-slate-950/60 text-slate-400">
                        Help type
                      </TableHead>
                      <TableHead className="border border-slate-800/60 bg-slate-950/60 text-center text-slate-400">
                        Priority
                      </TableHead>
                      <TableHead className="border border-slate-800/60 bg-slate-950/60 text-center text-slate-400">
                        Status
                      </TableHead>
                      <TableHead className="border border-slate-800/60 bg-slate-950/60 text-slate-400">
                        Details
                      </TableHead>
                      <TableHead className="border border-slate-800/60 bg-slate-950/60" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRequests.map((request) => (
                      <TableRow
                        key={request.id}
                        className="border border-slate-800/60 transition hover:bg-slate-900/60"
                        onClick={() => handleOpenRequest(request as any)}>
                        <TableCell className="border border-slate-800/60 bg-slate-950/40 p-4">
                          <div className="space-y-1">
                            <p className="font-semibold text-white">{request.requesterName}</p>
                            <p className="text-xs text-slate-500">{request.requesterRole}</p>
                            <p className="text-xs text-slate-500">{request.channel}</p>
                          </div>
                        </TableCell>
                        <TableCell className="border border-slate-800/60 p-4 text-slate-300">
                          {teams.find((team) => team.id === request.ownerTeam)?.label ?? "—"}
                        </TableCell>
                        <TableCell className="border border-slate-800/60 p-4 text-slate-300">
                          {helpTypes.find((type) => type.id === request.requestType)?.label ?? "—"}
                        </TableCell>
                        <TableCell className="border border-slate-800/60 p-4 text-center">
                          <Badge
                            className={`rounded-full border px-3 py-1 text-xs ${
                              priorityStyles[request.priority as keyof typeof priorityStyles].badge
                            }`}>
                            {priorityStyles[request.priority as keyof typeof priorityStyles].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="border border-slate-800/60 p-4 text-center">
                          <Badge
                            className={`rounded-full border px-3 py-1 text-xs ${
                              statusStyles[request.status as keyof typeof statusStyles].badge
                            }`}>
                            {statusStyles[request.status as keyof typeof statusStyles].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="border border-slate-800/60 p-4">
                          <p className="font-medium text-white">{request.summary}</p>
                          <p className="text-xs text-slate-500">{request.submittedAt}</p>
                        </TableCell>
                        <TableCell className="border border-slate-800/60 p-4">
                          <Button
                            variant="outline"
                            className="w-full rounded-xl border-slate-700 bg-slate-950/40 text-slate-100">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="mt-8 rounded-2xl border border-slate-800/70 bg-slate-950/40 p-6 text-center text-sm text-slate-400">
                  No help requests match the current filters.
                </div>
              )}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <p>
                  {filteredRequests.length === 0
                    ? "No requests to display."
                    : `Showing ${pageStart}–${pageEnd} of ${filteredRequests.length} requests`}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    className="rounded-xl border-slate-700 bg-slate-950/50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100 disabled:opacity-30"
                    onClick={() => setPage((prev) => Math.max(0, prev - 1))}>
                    Previous
                  </Button>
                  <span className="text-sm text-slate-300">
                    Page {filteredRequests.length === 0 ? 0 : page + 1} /{" "}
                    {filteredRequests.length === 0 ? 0 : pageCount}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= pageCount - 1 || filteredRequests.length === 0}
                    className="rounded-xl border-slate-700 bg-slate-950/50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100 disabled:opacity-30"
                    onClick={() => setPage((prev) => Math.min(pageCount - 1, prev + 1))}>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <StaffFooter />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border border-slate-800 bg-slate-950 text-slate-100 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              {activeRequest ? activeRequest.summary : "Help request"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {activeRequest
                ? `Ticket ${activeRequest.id} · ${activeRequest.submittedAt}`
                : "Select a row to review details."}
            </DialogDescription>
          </DialogHeader>
          {activeRequest ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Badge
                  className={`rounded-full border px-3 py-1 text-xs ${priorityStyles[activeRequest.priority].badge}`}>
                  Priority · {priorityStyles[activeRequest.priority].label}
                </Badge>
                <Badge className={`rounded-full border px-3 py-1 text-xs ${statusStyles[statusDraft].badge}`}>
                  Status · {statusStyles[statusDraft].label}
                </Badge>
              </div>
              <div className="space-y-2 rounded-2xl border border-slate-800/60 bg-slate-950/60 p-4">
                <p className="text-sm font-semibold text-white">Requester</p>
                <p className="text-sm text-slate-300">{activeRequest.requesterName}</p>
                <p className="text-xs text-slate-500">{activeRequest.requesterRole}</p>
                <p className="text-xs text-slate-500">{activeRequest.channel}</p>
              </div>
              <div className="space-y-2 rounded-2xl border border-slate-800/60 bg-slate-950/60 p-4">
                <p className="text-sm font-semibold text-white">Details</p>
                <p className="text-sm text-slate-300">{activeRequest.detail}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Status</Label>
                  <Select value={statusDraft} onValueChange={(value) => setStatusDraft(value as HelpRequestStatus)}>
                    <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                      {Object.entries(statusStyles).map(([id, meta]) => (
                        <SelectItem key={id} value={id}>
                          {meta.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-800/60 bg-slate-950/40 px-4 py-6 text-sm text-slate-400">
              <AlertCircle className="h-5 w-5 text-slate-500" />
              Select a help request from the grid to preview it here.
            </div>
          )}
          <DialogFooter className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button className="flex-1 rounded-2xl bg-sky-500 text-white hover:bg-sky-400">Save status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
