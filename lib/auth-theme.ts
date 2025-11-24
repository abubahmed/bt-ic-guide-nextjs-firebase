export type AuthThemeVariant = "staff" | "attendee";

type AuthThemeConfig = {
  variant: AuthThemeVariant;
  isStaff: boolean;
  pageBackgroundClass: string;
  glowOverlayClass: string;
  twoColumnCardClass: string;
  badgeClass: string;
  badgeLabel: string;
  headingClass: string;
  bodyTextClass: string;
  labelClass: string;
  inlineLinkClass: string;
  supportEyebrowClass: string;
  asideContainerClass: string;
  asideCardClass: string;
  asideCardHeadingClass: string;
  textAreaClass: string;
  singleCardContainerClass: string;
  singleCardHeadingClass: string;
  singleCardBodyClass: string;
  singleCardEyebrowClass: string;
  singleCardLinkClass: string;
};

const AUTH_THEME_MAP: Record<AuthThemeVariant, AuthThemeConfig> = {
  staff: {
    variant: "staff",
    isStaff: true,
    pageBackgroundClass: "bg-slate-950",
    glowOverlayClass: "bg-gradient-to-br from-slate-900 via-slate-800/80 to-slate-900",
    twoColumnCardClass:
      "relative grid gap-8 rounded-[32px] border border-slate-800/80 bg-slate-900/95 p-6 text-slate-100 shadow-[0_25px_90px_rgba(2,6,23,0.8)] backdrop-blur-xl sm:p-10 lg:grid-cols-[1.1fr_0.9fr]",
    badgeClass: "rounded-full bg-slate-800 text-[0.6rem] uppercase tracking-[0.4em] text-sky-300",
    badgeLabel: "Staff",
    headingClass: "text-white",
    bodyTextClass: "text-slate-300",
    labelClass: "text-slate-100",
    inlineLinkClass: "text-sky-300 hover:text-white",
    supportEyebrowClass: "text-slate-400",
    asideContainerClass: "border-slate-800 bg-gradient-to-b from-slate-900 to-slate-900/70 text-slate-100",
    asideCardClass: "border-slate-800 bg-slate-900/80",
    asideCardHeadingClass: "text-white",
    textAreaClass:
      "w-full resize-none rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40",
    singleCardContainerClass:
      "w-full max-w-md space-y-8 rounded-3xl border border-slate-900 bg-slate-950 p-10 text-slate-100 shadow-[0_25px_90px_rgba(2,6,23,0.6)]",
    singleCardHeadingClass: "text-white",
    singleCardBodyClass: "text-slate-300",
    singleCardEyebrowClass: "text-slate-400",
    singleCardLinkClass: "text-slate-100 hover:text-white",
  },
  attendee: {
    variant: "attendee",
    isStaff: false,
    pageBackgroundClass: "bg-sky-100/40",
    glowOverlayClass: "bg-gradient-to-br from-sky-200/70 via-white to-white",
    twoColumnCardClass:
      "relative grid gap-8 rounded-[32px] border border-sky-100/70 bg-white/95 p-6 text-black shadow-[0_25px_90px_rgba(14,28,56,0.18)] backdrop-blur-lg sm:p-10 lg:grid-cols-[1.1fr_0.9fr]",
    badgeClass: "rounded-full bg-sky-100 text-[0.6rem] uppercase tracking-[0.4em] text-sky-900",
    badgeLabel: "Attendee",
    headingClass: "text-sky-900",
    bodyTextClass: "text-black",
    labelClass: "text-black",
    inlineLinkClass: "text-sky-900 hover:text-black",
    supportEyebrowClass: "text-sky-900",
    asideContainerClass: "border-sky-50 bg-gradient-to-b from-white to-sky-50/60 text-black",
    asideCardClass: "border-sky-100 bg-white/80",
    asideCardHeadingClass: "text-sky-700",
    textAreaClass:
      "w-full resize-none rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm text-black placeholder:text-sky-700 focus:border-sky-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
    singleCardContainerClass:
      "w-full max-w-md space-y-8 rounded-3xl border border-sky-100 bg-white p-10 text-sky-800 shadow-sm",
    singleCardHeadingClass: "text-sky-800",
    singleCardBodyClass: "text-sky-600",
    singleCardEyebrowClass: "text-sky-500",
    singleCardLinkClass: "text-sky-600 hover:text-sky-700",
  },
};

export const getAuthTheme = (variant: AuthThemeVariant): AuthThemeConfig => AUTH_THEME_MAP[variant];
