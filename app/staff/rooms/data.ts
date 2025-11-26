const staff = [
  { id: "alex-chen", name: "Alex Chen", team: "operations", role: "Ops hub lead" },
  { id: "brianna-lee", name: "Brianna Lee", team: "operations", role: "Site logistics" },
  { id: "carter-simmons", name: "Carter Simmons", team: "operations", role: "Stage direction" },
  { id: "maya-patel", name: "Maya Patel", team: "programming", role: "Panel wrangler" },
  { id: "noor-kamal", name: "Noor Kamal", team: "programming", role: "Speaker concierge" },
  { id: "owen-blake", name: "Owen Blake", team: "programming", role: "Content editor" },
  { id: "leo-carter", name: "Leo Carter", team: "hospitality", role: "VIP liaison" },
  { id: "sara-ng", name: "Sara Ng", team: "hospitality", role: "Suite management" },
  { id: "tariq-farouq", name: "Tariq Farouq", team: "hospitality", role: "Guest transport" },
  { id: "ivy-lam", name: "Ivy Lam", team: "hospitality", role: "Culinary liaison" },
  { id: "diana-park", name: "Diana Park", team: "security", role: "Access control" },
  { id: "lara-cho", name: "Lara Cho", team: "security", role: "Badge command" },
  { id: "miles-porter", name: "Miles Porter", team: "security", role: "Escort detail" },
  { id: "nina-vasquez", name: "Nina Vasquez", team: "security", role: "Night shift lead" },
  { id: "luca-ramirez", name: "Luca Ramirez", team: "logistics", role: "Transport chief" },
] as const;

const roomTemplates = [
  { room: "1201", floor: "12", type: "Executive suite" },
  { room: "1203", floor: "12", type: "Executive suite" },
  { room: "901", floor: "9", type: "Corner king" },
  { room: "903", floor: "9", type: "Corner king" },
  { room: "905", floor: "9", type: "Corner king" },
  { room: "702", floor: "7", type: "Double queen" },
  { room: "704", floor: "7", type: "Double queen" },
  { room: "706", floor: "7", type: "Double queen" },
  { room: "502", floor: "5", type: "Standard king" },
  { room: "504", floor: "5", type: "Standard king" },
] as const;

const teams = [
  { id: "operations", label: "Operations" },
  { id: "programming", label: "Programming" },
  { id: "hospitality", label: "Hospitality" },
  { id: "security", label: "Security" },
  { id: "logistics", label: "Logistics" },
] as const;

export { staff, roomTemplates, teams };
