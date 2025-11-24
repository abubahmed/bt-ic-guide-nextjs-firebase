export type ThemeVariant = "staff" | "attendee";

type ThemeColors = {
  page: string;
  overlay: string;
  surface: string;
  surfaceAlt: string;
  surfaceMuted: string;
  surfaceContrast: string;
  borderStrong: string;
  borderMuted: string;
  borderContrast: string;
  textBase: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textLabel: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
};

type ThemeEffects = {
  shadowSurface: string;
  shadowContrast: string;
  blur: string;
};

type ThemeFields = {
  input: string;
  textarea: string;
};

export type ThemeDefinition = {
  id: ThemeVariant;
  label: string;
  mode: "dark" | "light";
  colors: ThemeColors;
  effects: ThemeEffects;
  fields: ThemeFields;
};

const themeMap: Record<ThemeVariant, ThemeDefinition> = {
  staff: {
    id: "staff",
    label: "Staff",
    mode: "dark",
    colors: {
      page: "bg-slate-950",
      overlay: "bg-gradient-to-br from-slate-900 via-slate-800/80 to-slate-900",
      surface: "bg-slate-900/95",
      surfaceAlt: "bg-gradient-to-b from-slate-900 to-slate-900/70",
      surfaceMuted: "bg-slate-900/80",
      surfaceContrast: "bg-slate-950",
      borderStrong: "border-slate-800/80",
      borderMuted: "border-slate-800",
      borderContrast: "border-slate-800",
      textBase: "text-slate-100",
      textPrimary: "text-white",
      textSecondary: "text-slate-300",
      textMuted: "text-slate-400",
      textLabel: "text-slate-100",
      accent: "text-sky-300 hover:text-white",
      badgeBg: "bg-slate-800",
      badgeText: "text-sky-300",
    },
    effects: {
      shadowSurface: "shadow-[0_25px_90px_rgba(2,6,23,0.8)]",
      shadowContrast: "shadow-[0_25px_90px_rgba(2,6,23,0.6)]",
      blur: "backdrop-blur-xl",
    },
    fields: {
      input:
        "h-11 rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus-visible:ring-sky-400/40 focus-visible:ring-1",
      textarea:
        "w-full resize-none rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40",
    },
  },
  attendee: {
    id: "attendee",
    label: "Attendee",
    mode: "light",
    colors: {
      page: "bg-sky-100/40",
      overlay: "bg-gradient-to-br from-sky-200/70 via-white to-white",
      surface: "bg-white/95",
      surfaceAlt: "bg-gradient-to-b from-white to-sky-50/60",
      surfaceMuted: "bg-white/80",
      surfaceContrast: "bg-white",
      borderStrong: "border-sky-100/70",
      borderMuted: "border-sky-50",
      borderContrast: "border-sky-100",
      textBase: "text-black",
      textPrimary: "text-sky-900",
      textSecondary: "text-black",
      textMuted: "text-sky-900",
      textLabel: "text-black",
      accent: "text-sky-900 hover:text-black",
      badgeBg: "bg-sky-100",
      badgeText: "text-sky-900",
    },
    effects: {
      shadowSurface: "shadow-[0_25px_90px_rgba(14,28,56,0.18)]",
      shadowContrast: "shadow-sm",
      blur: "backdrop-blur-lg",
    },
    fields: {
      input:
        "h-11 rounded-xl border border-sky-100 bg-white text-black placeholder:text-sky-900 focus:border-sky-900 focus-visible:ring-sky-900 focus-visible:ring-1",
      textarea:
        "w-full resize-none rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm text-black placeholder:text-sky-700 focus:border-sky-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
    },
  },
};

export const getTheme = (variant: ThemeVariant): ThemeDefinition => themeMap[variant];
