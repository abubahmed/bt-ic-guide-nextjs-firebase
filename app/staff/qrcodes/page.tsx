"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, UploadCloud } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import StaffFooter from "../components/footer";
import StaffHeader from "../components/header";

const teams = [
  { id: "operations", label: "Operations" },
  { id: "programming", label: "Programming" },
  { id: "hospitality", label: "Hospitality" },
  { id: "security", label: "Security" },
  { id: "logistics", label: "Logistics" },
];

const teamLookup = teams.reduce<Record<string, string>>((acc, team) => {
  acc[team.id] = team.label;
  return acc;
}, {});

const people = [
  { id: "alex-chen", label: "Alex Chen", team: "operations", role: "Ops hub lead" },
  { id: "brianna-lee", label: "Brianna Lee", team: "operations", role: "Site logistics" },
  { id: "carter-simmons", label: "Carter Simmons", team: "operations", role: "Stage direction" },
  { id: "dahlia-ortiz", label: "Dahlia Ortiz", team: "operations", role: "Equipment flow" },
  { id: "ethan-brooks", label: "Ethan Brooks", team: "operations", role: "Ops comms" },
  { id: "maya-patel", label: "Maya Patel", team: "programming", role: "Panel wrangler" },
  { id: "noor-kamal", label: "Noor Kamal", team: "programming", role: "Speaker concierge" },
  { id: "owen-blake", label: "Owen Blake", team: "programming", role: "Content editor" },
  { id: "priya-iyer", label: "Priya Iyer", team: "programming", role: "Studio coordinator" },
  { id: "quincy-hale", label: "Quincy Hale", team: "programming", role: "Backstage ops" },
  { id: "leo-carter", label: "Leo Carter", team: "hospitality", role: "VIP liaison" },
  { id: "sara-ng", label: "Sara Ng", team: "hospitality", role: "Suite management" },
  { id: "tariq-farouq", label: "Tariq Farouq", team: "hospitality", role: "Guest transport" },
  { id: "ivy-lam", label: "Ivy Lam", team: "hospitality", role: "Culinary liaison" },
  { id: "jamie-bowen", label: "Jamie Bowen", team: "hospitality", role: "Evening host" },
  { id: "diana-park", label: "Diana Park", team: "security", role: "Access control" },
  { id: "kofi-diaz", label: "Kofi Diaz", team: "security", role: "Perimeter lead" },
  { id: "lara-cho", label: "Lara Cho", team: "security", role: "Badge command" },
  { id: "miles-porter", label: "Miles Porter", team: "security", role: "Escort detail" },
  { id: "nina-vasquez", label: "Nina Vasquez", team: "security", role: "Night shift lead" },
  { id: "luca-ramirez", label: "Luca Ramirez", team: "logistics", role: "Transport chief" },
  { id: "opal-reed", label: "Opal Reed", team: "logistics", role: "Fleet ops" },
  { id: "paxton-ryu", label: "Paxton Ryu", team: "logistics", role: "Warehouse manager" },
  { id: "renee-yang", label: "Renee Yang", team: "logistics", role: "Inventory control" },
  { id: "samir-holt", label: "Samir Holt", team: "logistics", role: "Freight coordinator" },
];

const qrBands = [
  { id: "general", label: "General access" },
  { id: "vip", label: "VIP & suites" },
  { id: "ops", label: "Ops & logistics" },
] as const;

type BandKey = (typeof qrBands)[number]["id"];
type UploadScope = "master" | "team" | "person";
type DownloadScope = "all" | "team" | "person";
type WaveScope = "all" | BandKey;
type DownloadFormat = "zip" | "pdf";

const qrAssets = people.reduce<
  Record<
    string,
    {
      wave: BandKey;
      waveLabel: string;
      qrUrl: string;
      version: string;
      lastRotated: string;
    }
  >
>((acc, person, index) => {
  const band = qrBands[index % qrBands.length];
  const timing = index % 2 === 0 ? "Today · 08:00 AM" : "Yesterday · 09:30 PM";
  acc[person.id] = {
    wave: band.id,
    waveLabel: band.label,
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(person.label)}`,
    version: `v${1 + (index % 3)}.${(index * 2) % 10}`,
    lastRotated: timing,
  };
  return acc;
}, {});

const PAGE_SIZE = 10;

export default function StaffQrCodesPage() {
  const [uploadScope, setUploadScope] = useState<UploadScope>("master");
  const [uploadTeam, setUploadTeam] = useState(teams[0]?.id ?? "");
  const [uploadPerson, setUploadPerson] = useState(
    people.find((person) => person.team === (teams[0]?.id ?? ""))?.id ?? ""
  );
  const [downloadScope, setDownloadScope] = useState<DownloadScope>("all");
  const [downloadTeam, setDownloadTeam] = useState(teams[0]?.id ?? "");
  const [downloadPerson, setDownloadPerson] = useState(
    people.find((person) => person.team === (teams[0]?.id ?? ""))?.id ?? ""
  );
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>("zip");
  const [gridTeamFilter, setGridTeamFilter] = useState<string>("all");
  const [gridPersonFilter, setGridPersonFilter] = useState<string>("all");
  const [gridWaveFilter, setGridWaveFilter] = useState<WaveScope>("all");
  const [gridPage, setGridPage] = useState(0);

  useEffect(() => {
    const fallbackTeam = uploadTeam || teams[0]?.id || "";
    const teamPeople = people.filter((person) => person.team === fallbackTeam);
    if (!teamPeople.some((person) => person.id === uploadPerson)) {
      setUploadPerson(teamPeople[0]?.id ?? "");
    }
  }, [uploadTeam, uploadPerson]);

  useEffect(() => {
    const fallbackTeam = downloadTeam || teams[0]?.id || "";
    const teamPeople = people.filter((person) => person.team === fallbackTeam);
    if (!teamPeople.some((person) => person.id === downloadPerson)) {
      setDownloadPerson(teamPeople[0]?.id ?? "");
    }
  }, [downloadTeam, downloadPerson]);

  useEffect(() => {
    if (gridPersonFilter === "all") {
      return;
    }
    const person = people.find((candidate) => candidate.id === gridPersonFilter);
    if (!person || (gridTeamFilter !== "all" && person.team !== gridTeamFilter)) {
      setGridPersonFilter("all");
    }
  }, [gridTeamFilter, gridPersonFilter]);

  const peopleByTeam = useMemo(() => {
    if (gridTeamFilter === "all") {
      return people;
    }
    return people.filter((person) => person.team === gridTeamFilter);
  }, [gridTeamFilter]);

  const waveScopedPeople = useMemo(() => {
    if (gridWaveFilter === "all") {
      return peopleByTeam;
    }
    return peopleByTeam.filter((person) => qrAssets[person.id]?.wave === gridWaveFilter);
  }, [peopleByTeam, gridWaveFilter]);

  const visiblePeople = useMemo(() => {
    if (gridPersonFilter === "all") {
      return waveScopedPeople;
    }
    return waveScopedPeople.filter((person) => person.id === gridPersonFilter);
  }, [waveScopedPeople, gridPersonFilter]);

  useEffect(() => {
    setGridPage(0);
  }, [gridTeamFilter, gridPersonFilter, gridWaveFilter]);

  useEffect(() => {
    const maxPageIndex = Math.max(0, Math.ceil(visiblePeople.length / PAGE_SIZE) - 1);
    setGridPage((prev) => Math.min(prev, maxPageIndex));
  }, [visiblePeople.length]);

  const pageCount = Math.max(1, Math.ceil(visiblePeople.length / PAGE_SIZE));
  const paginatedPeople = visiblePeople.slice(gridPage * PAGE_SIZE, gridPage * PAGE_SIZE + PAGE_SIZE);
  const pageStart = visiblePeople.length === 0 ? 0 : gridPage * PAGE_SIZE + 1;
  const pageEnd = Math.min(visiblePeople.length, (gridPage + 1) * PAGE_SIZE);

  return (
    <main className="min-h-dvh bg-slate-950 text-slate-100">
      <StaffHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
        <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-sky-400">
                <span>QR kit staging</span>
                <span className="h-px w-8 bg-slate-800" />
                <span>Master · Team · Individual</span>
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-white">Upload every QR scenario from one surface</h2>
                <p className="mt-2 max-w-3xl text-base text-slate-400">
                  Pick the scope, drop in the ZIP, and run duplicate checks before releasing new badges. The same
                  pipeline handles master packs, team refreshes, or one-off replacements.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-5 rounded-2xl border border-slate-800/70 bg-slate-950/50 p-5">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Upload scope</p>
              <Tabs value={uploadScope} onValueChange={(value) => setUploadScope(value as UploadScope)}>
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
            {uploadScope !== "master" && (
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Team</Label>
                <Select value={uploadTeam} onValueChange={setUploadTeam}>
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
            )}
            {uploadScope === "person" && (
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Individual</Label>
                <Select value={uploadPerson} onValueChange={setUploadPerson}>
                  <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                    {people
                      .filter((person) => person.team === uploadTeam)
                      .map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <label
              htmlFor="qr-upload"
              className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 p-6 text-center transition hover:border-sky-500/60">
              <UploadCloud className="h-8 w-8 text-sky-300" />
              <div>
                <p className="text-sm font-semibold text-white">
                  {uploadScope === "master"
                    ? "Drop conference-wide QR ZIP"
                    : uploadScope === "team"
                    ? `Upload ${teamLookup[uploadTeam]} QR pack`
                    : `Upload QR for ${people.find((p) => p.id === uploadPerson)?.label ?? "staffer"}`}
                </p>
                <p className="text-xs text-slate-500">ZIP · Auto-detects filenames, badge owners, and expiry</p>
              </div>
              <input id="qr-upload" type="file" className="hidden" accept=".zip" />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                variant="outline"
                className="rounded-2xl border-slate-700 bg-slate-950/40 text-sm font-semibold text-slate-100 hover:border-sky-500/60">
                Validate bundle
              </Button>
              <Button className="rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400">
                Stage upload
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-sky-400">
                <span>BTIC Staff Ops</span>
                <span className="h-px w-8 bg-slate-800" />
                <span>Inline QR gallery</span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-white">Live QR workspace</h1>
                <p className="mt-2 max-w-3xl text-base text-slate-400">
                  Browse every staffer’s QR badge, confirm access bands, and spot stale assets before syncing to the
                  badge printers.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-[28px] border border-slate-800/80 bg-slate-950/50 p-4">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-slate-500">
              <span>Gallery mirrors the live badge portal</span>
              <span>Tip: replace assets before expiry</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-800/70 bg-slate-950/30 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
                <Filter className="h-4 w-4 text-sky-300" />
                <span>
                  {visiblePeople.length} staff · {visiblePeople.length} QR codes
                </span>
              </div>
              <Select value={gridTeamFilter} onValueChange={setGridTeamFilter}>
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
              <Select value={gridPersonFilter} onValueChange={setGridPersonFilter}>
                <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-56">
                  <SelectValue placeholder="Individual filter" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                  <SelectItem value="all">All staffers</SelectItem>
                  {peopleByTeam.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={gridWaveFilter} onValueChange={(value) => setGridWaveFilter(value as WaveScope)}>
                <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-52">
                  <SelectValue placeholder="Access band" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                  <SelectItem value="all">All bands</SelectItem>
                  {qrBands.map((band) => (
                    <SelectItem key={band.id} value={band.id}>
                      {band.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4">
              {paginatedPeople.length > 0 ? (
                <Table className="text-sm text-slate-200 border-collapse [&_td]:align-top">
                  <TableHeader>
                    <TableRow className="bg-slate-900/70 text-xs uppercase tracking-[0.25em] text-slate-500">
                      <TableHead className="min-w-[200px] border border-slate-800/60 bg-slate-950/60 text-slate-400">
                        Staffer · Team
                      </TableHead>
                      <TableHead className="border border-slate-800/60 bg-slate-950/60 text-center text-slate-400">
                        QR asset
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPeople.map((person) => {
                      const asset = qrAssets[person.id];
                      return (
                        <TableRow key={person.id} className="border border-slate-800/60">
                          <TableCell className="border border-slate-800/60 bg-slate-950/40 p-3">
                            <div>
                              <p className="font-semibold text-white">{person.label}</p>
                              <p className="text-xs text-slate-500">
                                {teamLookup[person.team]} • {person.role}
                              </p>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <Badge className="rounded-full border border-slate-700 bg-slate-900/60 text-[0.6rem] uppercase tracking-[0.25em] text-slate-200">
                                {asset?.waveLabel ?? "Unassigned"}
                              </Badge>
                              {asset?.version && (
                                <span className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
                                  {asset.version}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="border border-slate-800/60 p-0">
                            {asset ? (
                              <div className="flex flex-col items-center gap-3 p-4">
                                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={asset.qrUrl}
                                    alt={`${person.label} QR code`}
                                    className="h-40 w-40 rounded-xl border border-slate-800 bg-white object-contain p-3"
                                    loading="lazy"
                                  />
                                </div>
                                <p className="text-xs text-slate-500">{asset.lastRotated}</p>
                              </div>
                            ) : (
                              <div className="p-4 text-center text-xs text-slate-500">No QR assigned.</div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="mt-8 rounded-2xl border border-slate-800/70 bg-slate-950/40 p-6 text-center text-sm text-slate-400">
                  No QR codes match the current filters.
                </div>
              )}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <p>
                  {visiblePeople.length === 0
                    ? "No staffers to display."
                    : `Showing ${pageStart}–${pageEnd} of ${visiblePeople.length} staffers`}
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
                    Page {visiblePeople.length === 0 ? 0 : gridPage + 1} / {visiblePeople.length === 0 ? 0 : pageCount}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={gridPage >= pageCount - 1 || visiblePeople.length === 0}
                    className="rounded-xl border-slate-700 bg-slate-950/50 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100 disabled:opacity-30"
                    onClick={() => setGridPage((prev) => Math.min(pageCount - 1, prev + 1))}>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-800 bg-slate-900/60 p-6 lg:p-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
                <span>QR exports</span>
                <span className="h-px w-8 bg-slate-800" />
                <span>ZIP · PDF</span>
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-white">Export ready-to-share QR packs</h2>
              <p className="text-slate-400">
                Produce zipped bundles for distribution lists or PDF contact sheets for onsite scanners.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-300">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Most recent export</p>
                <p className="font-semibold text-white">5 mins ago · ZIP · All teams</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Generated by</p>
                <p className="font-semibold text-white">Jordan King</p>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <Tabs value={downloadScope} onValueChange={(value) => setDownloadScope(value as DownloadScope)}>
                <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-slate-900/60">
                  <TabsTrigger
                    value="all"
                    className="rounded-xl text-xs uppercase tracking-[0.2em] text-white data-[state=active]:text-black">
                    All teams
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
                      <Select value={downloadTeam} onValueChange={setDownloadTeam}>
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
                  </TabsContent>
                  <TabsContent value="person" className="space-y-3">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Team</Label>
                        <Select value={downloadTeam} onValueChange={setDownloadTeam}>
                          <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                            <SelectValue placeholder="Team" />
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
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Staffer</Label>
                        <Select value={downloadPerson} onValueChange={setDownloadPerson}>
                          <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                            <SelectValue placeholder="Person" />
                          </SelectTrigger>
                          <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                            {people
                              .filter((person) => person.team === downloadTeam)
                              .map((person) => (
                                <SelectItem key={person.id} value={person.id}>
                                  {person.label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="all">
                    <p className="text-sm text-slate-300">
                      Export includes QR codes for all active staffers and badge types.
                    </p>
                  </TabsContent>
                </div>
              </Tabs>
              <div className="mt-6 space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Access band focus</Label>
                <Select value={gridWaveFilter} onValueChange={(value) => setGridWaveFilter(value as WaveScope)}>
                  <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                    <SelectValue placeholder="Choose band" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                    <SelectItem value="all">All bands</SelectItem>
                    {qrBands.map((band) => (
                      <SelectItem key={band.id} value={band.id}>
                        {band.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Format</Label>
                <Select value={downloadFormat} onValueChange={(value) => setDownloadFormat(value as DownloadFormat)}>
                  <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                    <SelectValue placeholder="Choose format" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                    <SelectItem value="zip">ZIP (individual PNGs)</SelectItem>
                    <SelectItem value="pdf">PDF contact sheet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400">
                Generate {downloadFormat === "zip" ? "ZIP bundle" : "PDF contact sheet"}
              </Button>
            </div>
          </div>
        </section>
      </div>
      <StaffFooter />
    </main>
  );
}
