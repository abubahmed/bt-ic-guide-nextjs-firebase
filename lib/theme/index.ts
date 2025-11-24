export type ThemeVariant = "staff" | "attendee";

type ThemeDefinition = {
  id: ThemeVariant;
  label: string;
  mode: "dark" | "light";
  background: {
    page: string;
    glow: string;
  };
  layout: {
    card: string;
    singleCard: string;
  };
  text: {
    heading: string;
    body: string;
    label: string;
    support: string;
  };
  link: string;
  badge: string;
  aside: {
    container: string;
    card: string;
    heading: string;
  };
  form: {
    input: string;
    textarea: string;
  };
  singleCard: {
    eyebrow: string;
    heading: string;
    body: string;
    link: string;
  };
};

const themeMap: Record<ThemeVariant, ThemeDefinition> = {
  staff: {
    id: "staff",
    label: "Staff",
    mode: "dark",
    background: {
      page: "bg-slate-950",
      glow: "bg-gradient-to-br from-slate-900 via-slate-800/80 to-slate-900",
    },
    layout: {
      card:
        "border border-slate-800/80 bg-slate-900/95 text-slate-100 shadow-[0_25px_90px_rgba(2,6,23,0.8)] backdrop-blur-xl",
      singleCard:
        "w-full max-w-md space-y-8 rounded-3xl border border-slate-900 bg-slate-950 p-10 text-slate-100 shadow-[0_25px_90px_rgba(2,6,23,0.6)]",
    },
    text: {
      heading: "text-white",
      body: "text-slate-300",
      label: "text-slate-100",
      support: "text-slate-400",
    },
    link: "text-sky-300 hover:text-white",
    badge: "rounded-full bg-slate-800 text-[0.6rem] uppercase tracking-[0.4em] text-sky-300",
    aside: {
      container: "border-slate-800 bg-gradient-to-b from-slate-900 to-slate-900/70 text-slate-100",
      card: "border-slate-800 bg-slate-900/80",
      heading: "text-white",
    },
    form: {
      input:
        "h-11 rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus-visible:ring-sky-400/40 focus-visible:ring-1",
      textarea:
        "w-full resize-none rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40",
    },
    singleCard: {
      eyebrow: "text-slate-400",
      heading: "text-white",
      body: "text-slate-300",
      link: "text-slate-100 hover:text-white",
    },
  },
  attendee: {
    id: "attendee",
    label: "Attendee",
    mode: "light",
    background: {
      page: "bg-sky-100/40",
      glow: "bg-gradient-to-br from-sky-200/70 via-white to-white",
    },
    layout: {
      card:
        "border border-sky-100/70 bg-white/95 text-black shadow-[0_25px_90px_rgba(14,28,56,0.18)] backdrop-blur-lg",
      singleCard: "w-full max-w-md space-y-8 rounded-3xl border border-sky-100 bg-white p-10 text-sky-800 shadow-sm",
    },
    text: {
      heading: "text-sky-900",
      body: "text-black",
      label: "text-black",
      support: "text-sky-900",
    },
    link: "text-sky-900 hover:text-black",
    badge: "rounded-full bg-sky-100 text-[0.6rem] uppercase tracking-[0.4em] text-sky-900",
    aside: {
      container: "border-sky-50 bg-gradient-to-b from-white to-sky-50/60 text-black",
      card: "border-sky-100 bg-white/80",
      heading: "text-sky-700",
    },
    form: {
      input:
        "h-11 rounded-xl border border-sky-100 bg-white text-black placeholder:text-sky-900 focus:border-sky-900 focus-visible:ring-sky-900 focus-visible:ring-1",
      textarea:
        "w-full resize-none rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm text-black placeholder:text-sky-700 focus:border-sky-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
    },
    singleCard: {
      eyebrow: "text-sky-500",
      heading: "text-sky-800",
      body: "text-sky-600",
      link: "text-sky-600 hover:text-sky-700",
    },
  },
};

export const getTheme = (variant: ThemeVariant): ThemeDefinition => themeMap[variant];
