 "use client";
 
 import { useMemo, useState } from "react";
 import {
   CalendarRange,
   Download,
   Edit3,
   FileSpreadsheet,
   Filter,
   History,
   Search,
   Trash2,
   UploadCloud,
   Users,
   UserSquare2,
 } from "lucide-react";
 
 import { Badge } from "@/components/ui/badge";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 import { Textarea } from "@/components/ui/textarea";
 
 import StaffFooter from "../(dashboard)/components/footer";
 import StaffHeader from "../(dashboard)/components/header";
 
 type ScopeFilter = "all" | "master" | "team" | "person";
 
 const teams = [
   { id: "operations", label: "Operations" },
   { id: "programming", label: "Programming" },
   { id: "hospitality", label: "Hospitality" },
   { id: "security", label: "Security" },
   { id: "logistics", label: "Logistics" },
 ];
 
 const people = [
   { id: "alex-chen", label: "Alex Chen", team: "operations" },
   { id: "maya-patel", label: "Maya Patel", team: "programming" },
   { id: "leo-carter", label: "Leo Carter", team: "hospitality" },
   { id: "diana-park", label: "Diana Park", team: "security" },
   { id: "luca-ramirez", label: "Luca Ramirez", team: "logistics" },
 ];
 
 const scheduleRows = [
   {
     id: "master-2025",
     scope: "Master",
     owner: "All Staff",
     coverage: "Conference week",
     lastUpdate: "Today · 09:18",
     editor: "Jordan King",
     source: "Upload · CSV",
     summary: ["Arrivals + on-site training", "Gala dinner coverage", "Sponsor check-ins"],
   },
   {
     id: "team-ops-day1",
     scope: "Team",
     owner: "Operations",
     coverage: "Day 1 — full day",
     lastUpdate: "Today · 07:42",
     editor: "Maya Patel",
     source: "Manual edit",
     summary: ["Ballroom open + tech sweep", "Speaker wrangler rotation", "Badge control"],
   },
   {
     id: "team-programming-day2",
     scope: "Team",
     owner: "Programming",
     coverage: "Day 2 — morning",
     lastUpdate: "Yesterday",
     editor: "Cal Rivers",
     source: "Upload · XLSX",
     summary: ["Panels 3 + 4 briefings", "VIP escort partners", "Studio reset"],
   },
   {
     id: "person-alex",
     scope: "Person",
     owner: "Alex Chen",
     coverage: "Day 1 — afternoon",
     lastUpdate: "2h ago",
     editor: "Kofi Diaz",
     source: "Manual edit",
     summary: ["Green room coverage", "Fireside chat mic checks", "Ops stand-up"],
   },
   {
     id: "person-luca",
     scope: "Person",
     owner: "Luca Ramirez",
     coverage: "Full conference",
     lastUpdate: "3 days ago",
     editor: "Jordan King",
     source: "Upload · CSV",
     summary: ["Logistics overnight shift", "Sponsor suite reset", "Team transport dispatch"],
   },
 ];
 
 const historyEntries = [
   {
     id: "evt-1",
     actor: "Jordan King",
     action: "Uploaded master schedule",
     detail: "BTIC_master.csv · 148 rows · validation clean",
     timestamp: "Today · 09:18 AM",
     intent: "upload",
   },
   {
     id: "evt-2",
     actor: "Maya Patel",
     action: "Edited Operations shift blocks",
     detail: "Moved AV coverage to 14:30, reassigned two floaters",
     timestamp: "Today · 07:45 AM",
     intent: "edit",
   },
   {
     id: "evt-3",
     actor: "Kofi Diaz",
     action: "Deleted outdated badge control slot",
     detail: "Removed 23:00–00:00 slot for Alex Chen",
     timestamp: "Today · 07:12 AM",
     intent: "delete",
   },
   {
     id: "evt-4",
     actor: "Cal Rivers",
     action: "Uploaded Programming AM rotations",
     detail: "programming_day2.xlsx · 36 rows",
     timestamp: "Yesterday · 10:24 PM",
     intent: "upload",
   },
 ];
 
const intentStyles: Record<string, { badge: string; icon: JSX.Element; accent: string }> = {
  upload: {
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
    icon: <UploadCloud className="h-4 w-4 text-emerald-300" />,
    accent: "from-emerald-500/20 via-transparent to-transparent",
  },
   edit: {
     badge: "bg-sky-500/10 text-sky-300 border-sky-500/40",
     icon: <Edit3 className="h-4 w-4 text-sky-300" />,
     accent: "from-sky-500/20 via-transparent to-transparent",
   },
   delete: {
     badge: "bg-rose-500/10 text-rose-300 border-rose-500/40",
     icon: <Trash2 className="h-4 w-4 text-rose-300" />,
     accent: "from-rose-500/20 via-transparent to-transparent",
   },
 };
 
 export default function StaffSchedulesPage() {
   const [scopeFilter, setScopeFilter] = useState<ScopeFilter>("all");
   const [searchValue, setSearchValue] = useState("");
   const [selectedTeam, setSelectedTeam] = useState(teams[0]?.id ?? "");
   const [selectedPerson, setSelectedPerson] = useState(people[0]?.id ?? "");
   const [manualScope, setManualScope] = useState<"everyone" | "team" | "person">("team");
   const [selectedScheduleId, setSelectedScheduleId] = useState(scheduleRows[0]?.id ?? "");
 
   const filteredSchedules = useMemo(() => {
     return scheduleRows.filter((row) => {
       const matchesScope = scopeFilter === "all" || row.scope.toLowerCase() === scopeFilter;
       const matchesSearch = row.owner.toLowerCase().includes(searchValue.toLowerCase());
       return matchesScope && matchesSearch;
     });
   }, [scopeFilter, searchValue]);
 
   const selectedSchedule =
     scheduleRows.find((row) => row.id === selectedScheduleId) ?? scheduleRows[0] ?? null;
 
   return (
     <main className="min-h-dvh bg-slate-950 text-slate-100">
       <StaffHeader />
       <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
         <section className="rounded-[32px] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/70 to-slate-950 p-8 shadow-[0px_30px_80px_rgba(2,6,23,0.7)]">
           <div className="flex flex-wrap items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-sky-400">
             <span>Business Today International Conference</span>
             <span className="h-px w-8 bg-slate-800" />
             <span>Schedule intelligence command</span>
           </div>
           <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
             <div>
               <h1 className="text-3xl font-semibold text-white md:text-4xl">Manage Personal Schedules</h1>
               <p className="mt-3 max-w-3xl text-base text-slate-400">
                 Upload master files, team rotas, or single staffer spreadsheets, then finesse every slot manually without
                 leaving the ops console.
               </p>
             </div>
             <div className="flex flex-wrap gap-3">
               <Button className="rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400">
                 <Download className="mr-2 h-4 w-4" />
                 Download template
               </Button>
               <Button
                 variant="outline"
                 className="rounded-2xl border-slate-700 bg-slate-950/60 text-sm font-semibold text-slate-100 hover:border-sky-500/60">
                 <History className="mr-2 h-4 w-4" />
                 View audit trail
               </Button>
             </div>
           </div>
           <div className="mt-8 grid gap-4 md:grid-cols-3">
             {[
               {
                 label: "Active teams",
                 value: "27",
                 meta: "Connected to spreadsheets",
                 accent: "from-sky-500/30 via-transparent to-transparent",
               },
               {
                 label: "Individual schedules",
                 value: "312",
                 meta: "Manual + uploaded sources",
                 accent: "from-emerald-400/30 via-transparent to-transparent",
               },
               {
                 label: "Pending edits",
                 value: "8",
                 meta: "Awaiting approval",
                 accent: "from-amber-400/30 via-transparent to-transparent",
               },
             ].map((stat) => (
               <Card key={stat.label} className="border-slate-800/60 bg-slate-900/60 text-slate-100">
                 <CardContent className="relative overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-950/40 p-6">
                   <span
                     className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.accent} opacity-40`}
                   />
                   <div className="relative">
                     <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{stat.label}</p>
                     <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
                     <p className="text-sm text-slate-400">{stat.meta}</p>
                   </div>
                 </CardContent>
               </Card>
             ))}
           </div>
         </section>
 
         <section className="grid gap-6 lg:grid-cols-3">
           <Card className="border-slate-800 bg-slate-900/60 text-slate-100">
             <CardHeader className="border-b border-slate-800/70 pb-6">
               <div className="flex items-center gap-3">
                 <Badge className="rounded-full bg-slate-800/80 text-xs text-slate-200">
                   Master upload
                 </Badge>
                 <FileSpreadsheet className="h-4 w-4 text-sky-400" />
               </div>
               <CardTitle className="text-xl text-white">Conference-wide schedule</CardTitle>
               <CardDescription className="text-slate-400">
                 Import the full roster for all staffers in the official CSV/XLSX format.
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-4 pt-6">
               <label
                 htmlFor="master-upload"
                 className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-6 text-center transition hover:border-sky-500/60">
                 <UploadCloud className="h-8 w-8 text-sky-300" />
                 <div>
                   <p className="text-sm font-semibold text-white">Drop spreadsheet or browse</p>
                   <p className="text-xs text-slate-500">Supports .csv, .xlsx • Validates template columns</p>
                 </div>
                 <input id="master-upload" type="file" className="hidden" accept=".csv,.xlsx" />
               </label>
               <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                 <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Quality checks</p>
                 <div className="flex items-center justify-between text-sm">
                   <span className="text-slate-300">Header validation</span>
                   <Badge className="rounded-full bg-emerald-500/10 text-emerald-300">Ready</Badge>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                   <span className="text-slate-300">Overlap conflicts</span>
                   <Badge className="rounded-full bg-amber-500/10 text-amber-300">4 flagged</Badge>
                 </div>
               </div>
               <Button className="w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400">
                 Stage master upload
               </Button>
             </CardContent>
           </Card>
 
           <Card className="border-slate-800 bg-slate-900/60 text-slate-100">
             <CardHeader className="border-b border-slate-800/70 pb-6">
               <div className="flex items-center gap-3">
                 <Badge className="rounded-full bg-slate-800/80 text-xs text-slate-200">
                   Team upload
                 </Badge>
                 <Users className="h-4 w-4 text-emerald-300" />
               </div>
               <CardTitle className="text-xl text-white">Focused rota</CardTitle>
               <CardDescription className="text-slate-400">
                 Send a spreadsheet for a single team. Time blocks auto-tag against the master calendar.
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-4 pt-6">
               <div className="space-y-2">
                 <Label htmlFor="team-select" className="text-xs uppercase tracking-[0.35em] text-slate-500">
                   Select team
                 </Label>
                 <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                   <SelectTrigger id="team-select" className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
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
               <label
                 htmlFor="team-upload"
                 className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-6 text-center transition hover:border-emerald-500/60">
                 <UploadCloud className="h-8 w-8 text-emerald-300" />
                 <div>
                   <p className="text-sm font-semibold text-white">Upload {teams.find((t) => t.id === selectedTeam)?.label} file</p>
                   <p className="text-xs text-slate-500">CSV or XLSX · Auto-maps shifts + owners</p>
                 </div>
                 <input id="team-upload" type="file" className="hidden" accept=".csv,.xlsx" />
               </label>
               <Button className="w-full rounded-2xl border border-emerald-500/40 bg-slate-950/60 text-sm font-semibold text-emerald-200 hover:bg-slate-900">
                 Validate and stage upload
               </Button>
             </CardContent>
           </Card>
 
           <Card className="border-slate-800 bg-slate-900/60 text-slate-100">
             <CardHeader className="border-b border-slate-800/70 pb-6">
               <div className="flex items-center gap-3">
                 <Badge className="rounded-full bg-slate-800/80 text-xs text-slate-200">
                   Individual upload
                 </Badge>
                 <UserSquare2 className="h-4 w-4 text-amber-300" />
               </div>
               <CardTitle className="text-xl text-white">Single staffer</CardTitle>
               <CardDescription className="text-slate-400">
                 Fine tune a single person’s schedule without touching the wider team assignments.
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-4 pt-6">
               <div className="space-y-2">
                 <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Team</Label>
                 <Select value={selectedTeam} onValueChange={setSelectedTeam}>
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
               <div className="space-y-2">
                 <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Person</Label>
                 <Select value={selectedPerson} onValueChange={setSelectedPerson}>
                   <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                     <SelectValue placeholder="Select person" />
                   </SelectTrigger>
                   <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                     {people
                       .filter((person) => person.team === selectedTeam)
                       .map((person) => (
                         <SelectItem key={person.id} value={person.id}>
                           {person.label}
                         </SelectItem>
                       ))}
                   </SelectContent>
                 </Select>
               </div>
               <label
                 htmlFor="person-upload"
                 className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-6 text-center transition hover:border-amber-400/60">
                 <UploadCloud className="h-8 w-8 text-amber-300" />
                 <div>
                   <p className="text-sm font-semibold text-white">Upload schedule for {people.find((p) => p.id === selectedPerson)?.label}</p>
                   <p className="text-xs text-slate-500">Single-row template or quick CSV</p>
                 </div>
                 <input id="person-upload" type="file" className="hidden" accept=".csv,.xlsx" />
               </label>
               <Button className="w-full rounded-2xl bg-amber-400/80 text-sm font-semibold text-slate-950 hover:bg-amber-300">
                 Commit individual upload
               </Button>
             </CardContent>
           </Card>
         </section>
 
         <section className="grid gap-6 lg:grid-cols-2">
           <Card className="border-slate-800 bg-slate-900/60 text-slate-100">
             <CardHeader className="border-b border-slate-800/70 pb-6">
               <div className="flex items-center gap-3">
                 <Badge className="rounded-full bg-slate-800/80 text-xs text-slate-200">Manual entry</Badge>
                 <CalendarRange className="h-4 w-4 text-sky-300" />
               </div>
               <CardTitle className="text-xl text-white">Capture schedules without spreadsheets</CardTitle>
               <CardDescription className="text-slate-400">
                 Stage quick adjustments for the entire conference, a single team, or one staffer.
               </CardDescription>
             </CardHeader>
             <CardContent className="pt-6">
               <Tabs value={manualScope} onValueChange={(value) => setManualScope(value as typeof manualScope)} className="w-full">
                 <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-slate-900/50">
                   <TabsTrigger value="everyone" className="rounded-xl text-xs uppercase tracking-[0.2em]">
                     Everyone
                   </TabsTrigger>
                   <TabsTrigger value="team" className="rounded-xl text-xs uppercase tracking-[0.2em]">
                     Team
                   </TabsTrigger>
                   <TabsTrigger value="person" className="rounded-xl text-xs uppercase tracking-[0.2em]">
                     Person
                   </TabsTrigger>
                 </TabsList>
                 <div className="mt-6 space-y-6">
                   <TabsContent value="everyone" className="space-y-4">
                     <div className="space-y-2">
                       <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Headline</Label>
                       <Input placeholder="Conference-wide change title" className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100" />
                     </div>
                     <div className="space-y-2">
                       <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Window</Label>
                       <Input placeholder="e.g. Day 2 · 08:00-12:00" className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100" />
                     </div>
                     <div className="space-y-2">
                       <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Details</Label>
                       <Textarea placeholder="List all tasks, locations, and escalation contacts." className="min-h-[140px] rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100" />
                     </div>
                     <Button className="w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400">
                       Publish global adjustment
                     </Button>
                   </TabsContent>
 
                   <TabsContent value="team" className="space-y-4">
                     <div className="grid gap-4 md:grid-cols-2">
                       <div className="space-y-2">
                         <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Team</Label>
                         <Select value={selectedTeam} onValueChange={setSelectedTeam}>
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
                       <div className="space-y-2">
                         <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Date & time</Label>
                         <Input placeholder="Day · Time range" className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100" />
                       </div>
                     </div>
                     <div className="space-y-2">
                       <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Responsibilities</Label>
                       <Textarea placeholder="Outline shift, ownership, and fallback contact." className="min-h-[140px] rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100" />
                     </div>
                     <Button className="w-full rounded-2xl border border-sky-500/40 bg-slate-950/60 text-sm font-semibold text-sky-200 hover:bg-slate-900">
                       Save team entry
                     </Button>
                   </TabsContent>
 
                   <TabsContent value="person" className="space-y-4">
                     <div className="grid gap-4 md:grid-cols-2">
                       <div className="space-y-2">
                         <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Team</Label>
                         <Select value={selectedTeam} onValueChange={setSelectedTeam}>
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
                       <div className="space-y-2">
                         <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Person</Label>
                         <Select value={selectedPerson} onValueChange={setSelectedPerson}>
                           <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                             <SelectValue placeholder="Choose person" />
                           </SelectTrigger>
                           <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                             {people
                               .filter((person) => person.team === selectedTeam)
                               .map((person) => (
                                 <SelectItem key={person.id} value={person.id}>
                                   {person.label}
                                 </SelectItem>
                               ))}
                           </SelectContent>
                         </Select>
                       </div>
                     </div>
                     <div className="space-y-2">
                       <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Assignments</Label>
                       <Textarea placeholder="Team stand-ups, coverage blocks, transport calls, etc." className="min-h-[140px] rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100" />
                     </div>
                     <Button className="w-full rounded-2xl bg-amber-400/80 text-sm font-semibold text-slate-950 hover:bg-amber-300">
                       Save personal entry
                     </Button>
                   </TabsContent>
                 </div>
               </Tabs>
             </CardContent>
           </Card>
 
           <Card className="border-slate-800 bg-slate-900/60 text-slate-100">
             <CardHeader className="border-b border-slate-800/70 pb-6">
               <div className="flex items-center gap-3">
                 <Badge className="rounded-full bg-slate-800/80 text-xs text-slate-200">Edit spotlight</Badge>
                 <Edit3 className="h-4 w-4 text-emerald-300" />
               </div>
               <CardTitle className="text-xl text-white">Manually edit existing schedule</CardTitle>
               <CardDescription className="text-slate-400">
                 Select any record, adjust the details, and commit changes or delete outright.
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-5 pt-6">
               <div className="space-y-2">
                 <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Schedule</Label>
                 <Select value={selectedScheduleId} onValueChange={setSelectedScheduleId}>
                   <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                     <SelectValue placeholder="Select schedule" />
                   </SelectTrigger>
                   <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                     {scheduleRows.map((row) => (
                       <SelectItem key={row.id} value={row.id}>
                         {row.owner} · {row.coverage}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
               <div className="space-y-2">
                 <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Time window</Label>
                 <Input defaultValue={selectedSchedule?.coverage ?? ""} className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100" />
               </div>
               <div className="space-y-2">
                 <Label className="text-xs uppercase tracking-[0.35em] text-slate-500">Key tasks</Label>
                 <Textarea
                   defaultValue={(selectedSchedule?.summary ?? []).join("\n")}
                   className="min-h-[160px] rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100"
                 />
               </div>
               <div className="flex flex-wrap gap-3">
                 <Button className="flex-1 rounded-2xl bg-emerald-500 text-sm font-semibold text-slate-950 hover:bg-emerald-400">
                   Save update
                 </Button>
                 <Button
                   variant="outline"
                   className="flex-1 rounded-2xl border-rose-500/50 bg-slate-950/60 text-sm font-semibold text-rose-300 hover:bg-rose-500/10">
                   <Trash2 className="mr-2 h-4 w-4" />
                   Delete record
                 </Button>
               </div>
             </CardContent>
           </Card>
         </section>
 
         <section className="grid gap-6 lg:grid-cols-[1.8fr_1.2fr]">
           <Card className="border-slate-800 bg-slate-900/60 text-slate-100">
             <CardHeader className="border-b border-slate-800/70 pb-6">
               <div className="flex items-center gap-3">
                 <Badge className="rounded-full bg-slate-800/80 text-xs text-slate-200">Schedule library</Badge>
                 <Filter className="h-4 w-4 text-sky-300" />
               </div>
               <CardTitle className="text-xl text-white">Explore existing schedules</CardTitle>
               <CardDescription className="text-slate-400">
                 Filter by scope, search by owner, and jump into edit/delete actions instantly.
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-4 pt-6">
               <div className="flex flex-wrap gap-3">
                 <div className="relative flex-1">
                   <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                   <Input
                     value={searchValue}
                     onChange={(event) => setSearchValue(event.target.value)}
                     placeholder="Search by team or person"
                     className="w-full rounded-2xl border-slate-700 bg-slate-950/40 pl-12 text-slate-100"
                   />
                 </div>
                 <Select value={scopeFilter} onValueChange={(value) => setScopeFilter(value as ScopeFilter)}>
                   <SelectTrigger className="w-full rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 sm:w-48">
                     <SelectValue placeholder="Scope" />
                   </SelectTrigger>
                   <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                     <SelectItem value="all">All scopes</SelectItem>
                     <SelectItem value="master">Master</SelectItem>
                     <SelectItem value="team">Team</SelectItem>
                     <SelectItem value="person">Person</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               <Table className="[&_td]:align-top">
                 <TableHeader>
                   <TableRow className="border-slate-800 text-xs uppercase tracking-[0.2em] text-slate-500">
                     <TableHead>Scope</TableHead>
                     <TableHead>Owner / Coverage</TableHead>
                     <TableHead>Updated</TableHead>
                     <TableHead>Source</TableHead>
                     <TableHead className="text-right">Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {filteredSchedules.map((row) => (
                     <TableRow key={row.id} className="border-slate-800/70">
                       <TableCell>
                         <Badge
                           className={`rounded-full border ${
                             row.scope === "Master"
                               ? "border-sky-500/30 bg-sky-500/10 text-sky-200"
                               : row.scope === "Team"
                                 ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                                 : "border-amber-500/30 bg-amber-500/10 text-amber-200"
                           }`}>
                           {row.scope}
                         </Badge>
                       </TableCell>
                       <TableCell>
                         <p className="font-semibold text-white">{row.owner}</p>
                         <p className="text-sm text-slate-400">{row.coverage}</p>
                       </TableCell>
                       <TableCell>
                         <p className="text-sm text-slate-300">{row.lastUpdate}</p>
                         <p className="text-xs text-slate-500">By {row.editor}</p>
                       </TableCell>
                       <TableCell className="text-sm text-slate-300">{row.source}</TableCell>
                       <TableCell className="text-right">
                         <div className="flex justify-end gap-2">
                           <Button
                             size="sm"
                             variant="outline"
                             onClick={() => setSelectedScheduleId(row.id)}
                             className="rounded-xl border-slate-700 bg-slate-950/40 text-xs font-semibold text-slate-100 hover:border-sky-500/60">
                             Edit
                           </Button>
                           <Button
                             size="sm"
                             variant="outline"
                             className="rounded-xl border-rose-500/40 bg-slate-950/40 text-xs font-semibold text-rose-300 hover:bg-rose-500/10">
                             Delete
                           </Button>
                         </div>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </CardContent>
           </Card>
 
           <Card className="border-slate-800 bg-slate-900/60 text-slate-100">
             <CardHeader className="border-b border-slate-800/70 pb-6">
               <div className="flex items-center gap-3">
                 <Badge className="rounded-full bg-slate-800/80 text-xs text-slate-200">Edit history</Badge>
                 <History className="h-4 w-4 text-violet-300" />
               </div>
               <CardTitle className="text-xl text-white">Uploads & manual edits</CardTitle>
               <CardDescription className="text-slate-400">
                 Every change is captured with the editor, source, and timestamp for compliance review.
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-4 pt-6">
               {historyEntries.map((entry) => {
                 const meta = intentStyles[entry.intent];
                 return (
                   <div
                     key={entry.id}
                     className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                     <span className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${meta.accent}`} />
                     <div className="relative flex items-start gap-3">
                       <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-2">{meta.icon}</div>
                       <div>
                         <div className="flex flex-wrap items-center gap-2">
                           <p className="text-sm font-semibold text-white">{entry.actor}</p>
                           <Badge className={`rounded-full border px-2 py-0.5 text-[0.65rem] ${meta.badge}`}>
                             {entry.intent}
                           </Badge>
                         </div>
                         <p className="text-sm text-slate-300">{entry.action}</p>
                         <p className="text-xs text-slate-500">{entry.detail}</p>
                         <p className="mt-2 text-xs uppercase tracking-[0.35em] text-slate-500">{entry.timestamp}</p>
                       </div>
                     </div>
                   </div>
                 );
               })}
             </CardContent>
           </Card>
         </section>
       </div>
       <StaffFooter />
     </main>
   );
 }
