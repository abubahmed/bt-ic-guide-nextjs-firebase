import { cn } from "@/lib/utils";

type SkeletonBlockConfig = {
  lines?: number;
  contentHeight?: string;
  contentClassName?: string;
};

type StaffSectionSkeletonProps = {
  blocks?: SkeletonBlockConfig[];
  footerItems?: number;
  className?: string;
};

const DEFAULT_BLOCKS: SkeletonBlockConfig[] = [
  { lines: 3, contentHeight: "h-20" },
  { lines: 4, contentHeight: "h-32" },
];

const LINE_WIDTHS = ["w-full", "w-11/12", "w-10/12", "w-3/4", "w-2/3"];

export function StaffSectionSkeleton({
  blocks = DEFAULT_BLOCKS,
  footerItems = 0,
  className,
}: StaffSectionSkeletonProps) {
  return (
    <section
      className={cn(
        "rounded-[32px] border border-slate-700 bg-slate-800/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8",
        "animate-pulse",
        className
      )}>
      <div className="space-y-3">
        <div className="h-6 w-52 rounded-full bg-slate-700/80" />
        <div className="h-4 w-3/4 rounded-full bg-slate-800/80" />
      </div>
      <div className="mt-6 space-y-5">
        {blocks.map((block, index) => (
           <div key={`skeleton-block-${index}`} className="rounded-2xl border border-slate-700/60 bg-slate-900/45 p-4">
            <div className="space-y-2">
              {Array.from({ length: block.lines ?? 3 }).map((_, lineIdx) => (
                <div
                  key={`skeleton-line-${index}-${lineIdx}`}
                  className={cn(
                    "h-3 rounded-full bg-slate-800/70",
                    LINE_WIDTHS[(lineIdx + index) % LINE_WIDTHS.length]
                  )}
                />
              ))}
            </div>
            {block.contentHeight && (
               <div className={cn("mt-4 rounded-2xl bg-slate-800/60", block.contentHeight, block.contentClassName)} />
            )}
          </div>
        ))}
      </div>
      {footerItems > 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: footerItems }).map((_, idx) => (
             <div key={`skeleton-footer-${idx}`} className="h-11 rounded-2xl bg-slate-800/80" />
          ))}
        </div>
      )}
    </section>
  );
}
