"use client";

import { useEffect, useMemo, useState } from "react";
import { BellRing, Filter, SendHorizonal, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { teams, channels, seededAnnouncements } from "./data";
import StaffFooter from "../components/footer";
import StaffHeader from "../components/header";

type AudienceScope = "all" | "team";
type ScopeFilter = "all" | "everyone" | "team";
type TeamId = (typeof teams)[number]["id"];
type ChannelId = (typeof channels)[number]["id"];

type AnnouncementEntry = {
  id: string;
  title: string;
  message: string;
  channel: ChannelId;
  scope: "all" | TeamId;
  author: string;
  timestamp: string;
  status: "sent" | "scheduled";
};

const teamLookup = teams.reduce<Record<TeamId, string>>((acc, team) => {
  acc[team.id] = team.label;
  return acc;
}, {} as Record<TeamId, string>);

const channelLookup = channels.reduce<Record<ChannelId, string>>((acc, channel) => {
  acc[channel.id] = channel.label;
  return acc;
}, {} as Record<ChannelId, string>);

const PAGE_SIZE = 6;

export default function StaffAnnouncementsPage() {
  const [entries, setEntries] = useState<AnnouncementEntry[]>(seededAnnouncements);
  const [formChannel, setFormChannel] = useState<ChannelId>(channels[0].id);
  const [formScope, setFormScope] = useState<AudienceScope>("all");
  const [formTeam, setFormTeam] = useState<TeamId>(teams[0].id);
  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formSendWindow, setFormSendWindow] = useState("Now");

  const [channelFilter, setChannelFilter] = useState<"all" | ChannelId>("all");
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [gridPage, setGridPage] = useState(0);

  const filteredEntries = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return entries.filter((entry) => {
      if (channelFilter !== "all" && entry.channel !== channelFilter) {
        return false;
      }
      if (scopeFilter === "everyone" && entry.scope !== "all") {
        return false;
      }
      if (scopeFilter === "team" && entry.scope === "all") {
        return false;
      }
      if (normalizedSearch.length > 0) {
        const haystack = `${entry.title} ${entry.message} ${entry.author}`.toLowerCase();
        if (!haystack.includes(normalizedSearch)) {
          return false;
        }
      }
      return true;
    });
  }, [entries, channelFilter, scopeFilter, searchQuery]);

  const pageCount = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));
  const pagedEntries = filteredEntries.slice(gridPage * PAGE_SIZE, gridPage * PAGE_SIZE + PAGE_SIZE);
  const pageStart = filteredEntries.length === 0 ? 0 : gridPage * PAGE_SIZE + 1;
  const pageEnd = Math.min(filteredEntries.length, (gridPage + 1) * PAGE_SIZE);

  useEffect(() => {
    setGridPage(0);
  }, [channelFilter, scopeFilter, searchQuery]);

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleSubmit = () => {
    const newEntry: AnnouncementEntry = {
      id: `msg-${Date.now()}`,
      title: formTitle || "Untitled message",
      message: formMessage || "Pending content",
      channel: formChannel,
      scope: formScope === "all" ? "all" : formTeam,
      author: "You",
      timestamp: "Scheduled · " + formSendWindow,
      status: "scheduled",
    };
    setEntries((prev) => [newEntry, ...prev]);
    setFormTitle("");
    setFormMessage("");
    setFormSendWindow("Now");
  };

  return (
    <main className="min-h-dvh bg-slate-900 text-slate-100">
      <StaffHeader currentPage="announcements" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
        <section className="rounded-[32px] border border-slate-700 bg-slate-800/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div>
                <h1 className="text-3xl font-semibold text-white">Compose announcements</h1>
                <p className="mt-2 text-base text-slate-400">
                  Compose and send announcements through the app or email.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-[28px] border border-slate-700/70 bg-slate-900/50 p-6">
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Channel</Label>
                  <Select value={formChannel} onValueChange={(value) => setFormChannel(value as ChannelId)}>
                     <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-900/40 text-slate-100">
                      <SelectValue placeholder="Choose channel" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-700 bg-slate-900/90 text-slate-100">
                      {channels.map((channel) => (
                        <SelectItem key={channel.id} value={channel.id}>
                          {channel.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Audience scope</Label>
                  <Tabs value={formScope} onValueChange={(value) => setFormScope(value as AudienceScope)}>
                    <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-slate-800/60">
                      <TabsTrigger
                        value="all"
                        className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                        Everyone
                      </TabsTrigger>
                      <TabsTrigger
                        value="team"
                        className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                        Specific team
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                {formScope === "team" && (
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Team</Label>
                    <Select value={formTeam} onValueChange={(value) => setFormTeam(value as TeamId)}>
                      <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-900/40 text-slate-100">
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-700 bg-slate-900/90 text-slate-100">
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Title</Label>
                  <Input
                    value={formTitle}
                    onChange={(event) => setFormTitle(event.target.value)}
                    placeholder="e.g., Door rotations begin in 15"
                     className="rounded-2xl border-slate-700 bg-slate-900/40 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Message</Label>
                  <Textarea
                    value={formMessage}
                    onChange={(event) => setFormMessage(event.target.value)}
                    placeholder="Share logistics, links, or next steps..."
                    className="min-h-[120px] rounded-2xl border-slate-700 bg-slate-900/40 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                variant="outline"
                 className="flex-1 rounded-2xl border-slate-700 bg-slate-900/40 text-sm font-semibold text-slate-100 hover:border-sky-500/60">
                Preview message
              </Button>
              <Button
                className="flex-1 rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400"
                onClick={handleSubmit}>
                <SendHorizonal className="mr-2 h-4 w-4" />
                Stage announcement
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-700 bg-slate-800/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div>
                <h2 className="text-3xl font-semibold text-white">Past announcements</h2>
                <p className="mt-2 max-w-3xl text-base text-slate-400">
                  Filter by channel, scope, or keyword. Delete select updates if necessary.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-[28px] border border-slate-700/80 bg-slate-900/50 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <Select value={channelFilter} onValueChange={(value) => setChannelFilter(value as "all" | ChannelId)}>
                 <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-900/40 text-slate-100 sm:w-48">
                  <SelectValue placeholder="Channel filter" />
                </SelectTrigger>
                <SelectContent className="border-slate-700 bg-slate-900/90 text-slate-100">
                  <SelectItem value="all">All channels</SelectItem>
                  {channels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      {channel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={scopeFilter} onValueChange={(value) => setScopeFilter(value as ScopeFilter)}>
                <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-900/40 text-slate-100 sm:w-48">
                  <SelectValue placeholder="Scope filter" />
                </SelectTrigger>
                <SelectContent className="border-slate-700 bg-slate-900/90 text-slate-100">
                  <SelectItem value="all">All scopes</SelectItem>
                  <SelectItem value="everyone">Everyone</SelectItem>
                  <SelectItem value="team">Team-targeted</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search title, message, author"
                 className="w-full rounded-2xl border-slate-700 bg-slate-900/30 text-slate-100 placeholder:text-slate-500 sm:w-64"
              />
            </div>
            <div className="mt-4">
              {pagedEntries.length > 0 ? (
                <Table className="text-sm text-slate-200 border-collapse [&_td]:align-top">
                  <TableHeader>
                     <TableRow className="bg-slate-800/70 text-xs uppercase tracking-[0.25em] text-slate-500">
                      <TableHead className="min-w-[220px] border border-slate-700/60 bg-slate-900/60 text-slate-400">
                        Title · Message
                      </TableHead>
                      <TableHead className="border border-slate-700/60 text-slate-400">Channel</TableHead>
                      <TableHead className="border border-slate-700/60 text-slate-400">Audience</TableHead>
                      <TableHead className="border border-slate-700/60 text-slate-400">Author</TableHead>
                      <TableHead className="border border-slate-700/60 text-right text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedEntries.map((entry) => (
                       <TableRow key={entry.id} className="border border-slate-700/60">
                        <TableCell className="border border-slate-700/60 bg-slate-900/40 p-3">
                          <p className="font-semibold text-white">{entry.title}</p>
                          <p className="text-xs text-slate-500">{entry.message}</p>
                        </TableCell>
                        <TableCell className="border border-slate-700/60 p-3">
                          <Badge className="rounded-full border border-slate-700 bg-slate-900/60 text-[0.65rem] text-slate-200">
                            {channelLookup[entry.channel]}
                          </Badge>
                        </TableCell>
                        <TableCell className="border border-slate-700/60 p-3">
                          {entry.scope === "all" ? (
                            <p className="text-sm font-medium text-white">Everyone</p>
                          ) : (
                            <>
                              <p className="text-sm font-medium text-white">{teamLookup[entry.scope]}</p>
                            </>
                          )}
                        </TableCell>
                        <TableCell className="border border-slate-700/60 p-3">
                          <p className="text-sm font-medium text-white">{entry.author}</p>
                          <p className="text-xs text-slate-400">{entry.timestamp}</p>
                        </TableCell>
                        <TableCell className="border border-slate-700/60 p-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-slate-700 bg-slate-900/50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100 hover:border-rose-500/60"
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
                 <div className="rounded-2xl border border-slate-700/70 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
                  No announcements match the current filters.
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <p>
                {filteredEntries.length === 0
                  ? "No messages to display."
                  : `Showing ${pageStart}–${pageEnd} of ${filteredEntries.length} messages`}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={gridPage === 0}
                   className="rounded-xl border-slate-700 bg-slate-900/50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100 disabled:opacity-30"
                  onClick={() => setGridPage((prev) => Math.max(0, prev - 1))}>
                  Previous
                </Button>
                <span className="text-sm text-slate-300">
                  Page {filteredEntries.length === 0 ? 0 : gridPage + 1} /{" "}
                  {filteredEntries.length === 0 ? 0 : pageCount}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={gridPage >= pageCount - 1 || filteredEntries.length === 0}
                   className="rounded-xl border-slate-700 bg-slate-900/50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100 disabled:opacity-30"
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
