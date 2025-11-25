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

export { people, qrBands };
