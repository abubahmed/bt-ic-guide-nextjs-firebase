"use client";

import { useEffect, useMemo, useState } from "react";
import { BellRing, Filter, SendHorizonal, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import StaffFooter from "../components/footer";
import StaffHeader from "../components/header";

const teams = [
  { id: "operations", label: "Operations" },
  { id: "programming", label: "Programming" },
  { id: "hospitality", label: "Hospitality" },
  { id: "security", label: "Security" },
  { id: "logistics", label: "Logistics" },
] as const;

const channels = [
  { id: "push", label: "App Push" },
  { id: "sms", label: "SMS" },
  { id: "email", label: "Email" },
  { id: "stage", label: "Stage screen" },
] as const;

type AnnouncementType = "announcement" | "reminder";
type AudienceScope = "all" | "team";
type ScopeFilter = "all" | "everyone" | "team";
type TeamId = (typeof teams)[number]["id"];
type ChannelId = (typeof channels)[number]["id"];

type AnnouncementEntry = {
  id: string;
  title: string;
  message: string;
  type: AnnouncementType;
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

const seededAnnouncements: AnnouncementEntry[] = [
  {
    id: "msg-01",
    title: "Door rotations begin in 15",
    message: "Security + logistics, swap badges and stage at Ballroom North.",
    type: "reminder",
    channel: "push",
    scope: "all",
    author: "Jordan King",
    timestamp: "Today · 09:15 AM",
    status: "sent",
  },
  {
    id: "msg-02",
    title: "Hospitality suites briefing",
    message: "Hospitality leads meet at Ops Loft room 4 for VIP prep.",
    type: "announcement",
    channel: "email",
    scope: "hospitality",
    author: "Nora Quinn",
    timestamp: "Today · 08:42 AM",
    status: "sent",
  },
  {
    id: "msg-03",
    title: "Stage walk-through",
    message: "Programming + operations join the ballroom walk-through at 11:00.",
    type: "announcement",
    channel: "stage",
    scope: "programming",
    author: "Cal Rivers",
    timestamp: "Today · 07:55 AM",
    status: "sent",
  },
  {
    id: "msg-04",
    title: "Reminder · shuttle manifests",
    message: "Logistics verify shuttle manifests before 14:00 dispatch.",
    type: "reminder",
    channel: "sms",
    scope: "logistics",
    author: "Alex Chen",
    timestamp: "Today · 06:45 AM",
    status: "sent",
  },
  {
    id: "msg-05",
    title: "Attendee dinner seating",
    message: "Attendees check app for assigned tables at 18:30 dinner.",
    type: "announcement",
    channel: "push",
    scope: "all",
    author: "Maya Patel",
    timestamp: "Yesterday · 10:12 PM",
    status: "sent",
  },
  {
    id: "msg-06",
    title: "Badge troubleshooting stand-up",
    message: "Security bring escalations to the Command Deck at 09:45.",
    type: "reminder",
    channel: "sms",
    scope: "security",
    author: "Kofi Diaz",
    timestamp: "Scheduled · 09:30 AM",
    status: "scheduled",
  },
] as const;

const PAGE_SIZE = 6;

export default function StaffAnnouncementsPage() {
  const [entries, setEntries] = useState<AnnouncementEntry[]>(seededAnnouncements);
  const [formType, setFormType] = useState<AnnouncementType>("announcement");
  const [formChannel, setFormChannel] = useState<ChannelId>(channels[0].id);
  const [formScope, setFormScope] = useState<AudienceScope>("all");
  const [formTeam, setFormTeam] = useState<TeamId>(teams[0].id);
  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formSendWindow, setFormSendWindow] = useState("Now");

  const [channelFilter, setChannelFilter] = useState<"all" | ChannelId>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | AnnouncementType>("all");
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [gridPage, setGridPage] = useState(0);

  const totals = useMemo(() => {
    const announcementCount = entries.filter((entry) => entry.type === "announcement").length;
    const reminderCount = entries.length - announcementCount;
    const scheduledCount = entries.filter((entry) => entry.status === "scheduled").length;
    return { announcementCount, reminderCount, scheduledCount };
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return entries.filter((entry) => {
      if (channelFilter !== "all" && entry.channel !== channelFilter) {
        return false;
      }
      if (typeFilter !== "all" && entry.type !== typeFilter) {
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
  }, [entries, channelFilter, typeFilter, scopeFilter, searchQuery]);

  const pageCount = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));
  const pagedEntries = filteredEntries.slice(gridPage * PAGE_SIZE, gridPage * PAGE_SIZE + PAGE_SIZE);
  const pageStart = filteredEntries.length === 0 ? 0 : gridPage * PAGE_SIZE + 1;
  const pageEnd = Math.min(filteredEntries.length, (gridPage + 1) * PAGE_SIZE);

  useEffect(() => {
    setGridPage(0);
  }, [channelFilter, typeFilter, scopeFilter, searchQuery]);

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleSubmit = () => {
    const newEntry: AnnouncementEntry = {
      id: `msg-${Date.now()}`,
      title: formTitle || "Untitled message",
      message: formMessage || "Pending content",
      type: formType,
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

  const scopeDescription =
    formScope === "all"
      ? "Broadcasts to every attendee and staffer."
      : `Targets only ${teamLookup[formTeam]} recipients.`;

  return (
    <main className="min-h-dvh bg-slate-950 text-slate-100">
      <StaffHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
        <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-sky-400">
                <span>Announcements console</span>
                <span className="h-px w-8 bg-slate-800" />
                <span>App · SMS · Email</span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-white">Compose announcements + reminders</h1>
                <p className="mt-2 max-w-3xl text-base text-slate-400">
                  Stage a quick reminder or a polished announcement, then push it through app push, SMS, or email
                  channels with one consistent template.
                </p>
              </div>
            </div>
            <div className="grid gap-3 text-center text-xs uppercase tracking-[0.35em] text-slate-500 sm:grid-cols-3 lg:text-right">
              <div className="rounded-3xl border border-slate-800/70 bg-slate-950/50 px-4 py-3 text-slate-400">
                <p className="text-3xl font-semibold text-white">{totals.announcementCount}</p>
                <p>Announcements</p>
              </div>
              <div className="rounded-3xl border border-slate-800/70 bg-slate-950/50 px-4 py-3 text-slate-400">
                <p className="text-3xl font-semibold text-white">{totals.reminderCount}</p>
                <p>Reminders</p>
              </div>
              <div className="rounded-3xl border border-slate-800/70 bg-slate-950/50 px-4 py-3 text-slate-400">
                <p className="text-3xl font-semibold text-white">{totals.scheduledCount}</p>
                <p>Scheduled</p>
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-[28px] border border-slate-800/70 bg-slate-950/50 p-6">
            <Tabs value={formType} onValueChange={(value) => setFormType(value as AnnouncementType)}>
              <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-slate-900/60">
                <TabsTrigger
                  value="announcement"
                  className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                  Announcement
                </TabsTrigger>
                <TabsTrigger
                  value="reminder"
                  className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                  Reminder
                </TabsTrigger>
              </TabsList>
              <TabsContent value="announcement" className="mt-6 text-sm text-slate-400">
                Use for formal updates, major shifts, or attendee-facing moments.
              </TabsContent>
              <TabsContent value="reminder" className="mt-6 text-sm text-slate-400">
                Ping teams minutes before key handoffs or deadlines.
              </TabsContent>
            </Tabs>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Channel</Label>
                  <Select value={formChannel} onValueChange={(value) => setFormChannel(value as ChannelId)}>
                    <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                      <SelectValue placeholder="Choose channel" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
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
                    <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-slate-900/60">
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
                      <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                        <SelectValue placeholder="Select team" />
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
                <p className="text-xs text-slate-500">{scopeDescription}</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Title</Label>
                  <Input
                    value={formTitle}
                    onChange={(event) => setFormTitle(event.target.value)}
                    placeholder="e.g., Door rotations begin in 15"
                    className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Message</Label>
                  <Textarea
                    value={formMessage}
                    onChange={(event) => setFormMessage(event.target.value)}
                    placeholder="Share logistics, links, or next steps..."
                    className="min-h-[120px] rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Send window</Label>
                  <Input
                    value={formSendWindow}
                    onChange={(event) => setFormSendWindow(event.target.value)}
                    placeholder="Now · 10 min · 09:45 AM, etc."
                    className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-2xl border-slate-700 bg-slate-950/40 text-sm font-semibold text-slate-100 hover:border-sky-500/60">
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

        <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-sky-400">
                <span>Historical feed</span>
                <span className="h-px w-8 bg-slate-800" />
                <span>Searchable + filterable</span>
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-white">Past announcements + reminders</h2>
                <p className="mt-2 max-w-3xl text-base text-slate-400">
                  Filter by channel, scope, or tone. Delete stale updates to keep the queue focused on the current
                  conference run of show.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-800/70 bg-slate-950/40 px-4 py-3 text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">
              <BellRing className="h-4 w-4 text-sky-300" />
              <span>{entries.length} total messages</span>
            </div>
          </div>
          <div className="mt-6 rounded-[28px] border border-slate-800/80 bg-slate-950/50 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-800/70 bg-slate-950/30 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
                <Filter className="h-4 w-4 text-sky-300" />
                <span>{filteredEntries.length} visible</span>
              </div>
              <Select value={channelFilter} onValueChange={(value) => setChannelFilter(value as "all" | ChannelId)}>
                <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
                  <SelectValue placeholder="Channel filter" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                  <SelectItem value="all">All channels</SelectItem>
                  {channels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      {channel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as "all" | AnnouncementType)}>
                <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
                  <SelectValue placeholder="Type filter" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                  <SelectItem value="all">Announcements + Reminders</SelectItem>
                  <SelectItem value="announcement">Announcements</SelectItem>
                  <SelectItem value="reminder">Reminders</SelectItem>
                </SelectContent>
              </Select>
              <Select value={scopeFilter} onValueChange={(value) => setScopeFilter(value as ScopeFilter)}>
                <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
                  <SelectValue placeholder="Scope filter" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                  <SelectItem value="all">All scopes</SelectItem>
                  <SelectItem value="everyone">Everyone</SelectItem>
                  <SelectItem value="team">Team-targeted</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search title, message, author"
                className="w-full rounded-2xl border-slate-700 bg-slate-950/30 text-slate-100 placeholder:text-slate-500 sm:w-64"
              />
            </div>
            <div className="mt-4">
              {pagedEntries.length > 0 ? (
                <Table className="text-sm text-slate-200 border-collapse [&_td]:align-top">
                  <TableHeader>
                    <TableRow className="bg-slate-900/70 text-xs uppercase tracking-[0.25em] text-slate-500">
                      <TableHead className="min-w-[220px] border border-slate-800/60 bg-slate-950/60 text-slate-400">
                        Title · Message
                      </TableHead>
                      <TableHead className="border border-slate-800/60 text-slate-400">Channel · Type</TableHead>
                      <TableHead className="border border-slate-800/60 text-slate-400">Audience</TableHead>
                      <TableHead className="border border-slate-800/60 text-slate-400">Status · Author</TableHead>
                      <TableHead className="border border-slate-800/60 text-right text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedEntries.map((entry) => (
                      <TableRow key={entry.id} className="border border-slate-800/60">
                        <TableCell className="border border-slate-800/60 bg-slate-950/40 p-3">
                          <p className="font-semibold text-white">{entry.title}</p>
                          <p className="text-xs text-slate-500">{entry.message}</p>
                        </TableCell>
                        <TableCell className="border border-slate-800/60 p-3">
                          <div className="flex flex-wrap gap-2">
                            <Badge className="rounded-full border border-slate-700 bg-slate-950/60 text-[0.65rem] text-slate-200">
                              {channelLookup[entry.channel]}
                            </Badge>
                            <Badge
                              className={`rounded-full px-3 py-1 text-[0.65rem] ${
                                entry.type === "announcement"
                                  ? "border border-sky-500/40 bg-sky-500/10 text-sky-200"
                                  : "border border-amber-500/40 bg-amber-500/10 text-amber-200"
                              }`}>
                              {entry.type}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="border border-slate-800/60 p-3">
                          {entry.scope === "all" ? (
                            <p className="text-sm font-medium text-white">Entire roster</p>
                          ) : (
                            <>
                              <p className="text-sm font-medium text-white">{teamLookup[entry.scope]}</p>
                              <p className="text-xs text-slate-500">Team-targeted</p>
                            </>
                          )}
                        </TableCell>
                        <TableCell className="border border-slate-800/60 p-3">
                          <p className="text-sm font-medium text-white">
                            {entry.status === "sent" ? "Sent" : "Scheduled"}
                          </p>
                          <p className="text-xs text-slate-400">{entry.timestamp}</p>
                          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">{entry.author}</p>
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
                  className="rounded-xl border-slate-700 bg-slate-950/50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100 disabled:opacity-30"
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
