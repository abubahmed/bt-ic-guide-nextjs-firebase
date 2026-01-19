"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { DownloadCloud, FileImage, Trash2, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import StaffFooter from "../components/footer";
import StaffHeader from "../components/header";

type MapMeta = {
  name: string;
  size: string;
  updated: string;
};

const seededMap: MapMeta & { src: string } = {
  src: "/window.svg",
  name: "BTIC_Master_Map.png",
  size: "1.8 MB",
  updated: "Today · 07:00 AM",
};

const formatBytes = (bytes: number) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / Math.pow(1024, exponent);
  const precision = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(precision)} ${units[exponent]}`;
};

export default function StaffMapPage() {
  const [liveMap, setLiveMap] = useState<string | null>(seededMap.src);
  const [liveMeta, setLiveMeta] = useState<MapMeta | null>({
    name: seededMap.name,
    size: seededMap.size,
    updated: seededMap.updated,
  });

  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [stagedPreview, setStagedPreview] = useState<string | null>(null);
  const [stagedMeta, setStagedMeta] = useState<MapMeta | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setStagedFile(file);

    if (!file) {
      setStagedPreview(null);
      setStagedMeta(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setStagedPreview(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
    setStagedMeta({
      name: file.name,
      size: formatBytes(file.size),
      updated: "Ready to stage",
    });
  };

  const handleStageUpload = () => {
    if (!stagedPreview || !stagedMeta) {
      return;
    }
    setLiveMap(stagedPreview);
    setLiveMeta({
      ...stagedMeta,
      updated: "Just staged · Pending publish",
    });
    setStagedFile(null);
    setStagedPreview(null);
    setStagedMeta(null);
  };

  const handleClearSelection = () => {
    setStagedFile(null);
    setStagedPreview(null);
    setStagedMeta(null);
  };

  const handleDownload = () => {
    if (!liveMap || typeof window === "undefined") {
      return;
    }
    const link = document.createElement("a");
    link.href = liveMap;
    link.download = liveMeta?.name ?? "btic-map.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = () => {
    setLiveMap(null);
    setLiveMeta(null);
  };

  const hasStagedUpload = Boolean(stagedFile && stagedPreview && stagedMeta);

  return (
    <main className="min-h-dvh bg-slate-900 text-slate-100">
      <StaffHeader currentPage="map" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
        <section className="rounded-[32px] border border-slate-700 bg-slate-800/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div>
                <h1 className="text-3xl font-semibold text-white">Upload event map</h1>
                <p className="mt-2 text-base text-slate-400">
                  Upload the latest event floor map, or delete or download the current one.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-6">
            <div className="space-y-5 rounded-[28px] border border-slate-700/70 bg-slate-900/50 p-5">
              <div className="space-y-3">
                <label
                  htmlFor="map-file-upload"
                  className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center transition hover:border-sky-500/60">
                  <UploadCloud className="h-10 w-10 text-sky-300" />
                  <div>
                    <p className="text-sm font-semibold text-white">{stagedMeta?.name ?? "Drop JPG, PNG, or SVG"}</p>
                  </div>
                  <input
                    id="map-file-upload"
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  variant="outline"
                  className="rounded-2xl border-slate-700 bg-slate-900/40 text-sm font-semibold text-slate-100 hover:border-sky-500/60"
                  onClick={handleDownload}
                  disabled={!liveMap}>
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Download current map
                </Button>
                <Button
                  className="rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400 disabled:bg-slate-700"
                  onClick={handleStageUpload}
                  disabled={!hasStagedUpload}>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Stage replacement
                </Button>
              </div>
              {hasStagedUpload && (
                <div className="flex flex-col gap-1 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-left">
                  <p className="text-sm font-semibold text-white">{stagedMeta?.name}</p>
                  <p className="text-xs text-amber-100">
                    {stagedMeta?.size} · {stagedMeta?.updated}
                  </p>
                  <Button
                    variant="ghost"
                    className="self-start rounded-xl px-3 py-1 text-xs font-semibold text-amber-200 hover:bg-amber-500/20"
                    onClick={handleClearSelection}>
                    Clear selection
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-700 bg-slate-800/70 p-6 shadow-[0px_30px_80px_rgba(2,6,23,0.45)] lg:p-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-3">
              <div>
                <h2 className="text-3xl font-semibold text-white">Map preview</h2>
                <p className="mt-2 text-base text-slate-400">
                  The panel below displays the current event floor map.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[3fr_1fr]">
            <div className="relative min-h-[420px] rounded-[32px] border border-slate-700/70 bg-slate-900/50">
              {liveMap ? (
                <Image
                  src={liveMap}
                  alt="Published staff map"
                  fill
                  className="rounded-[32px] object-contain p-4"
                  sizes="(max-width: 1024px) 100vw, 900px"
                  priority
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-slate-500">
                  <FileImage className="h-12 w-12 text-slate-600" />
                  <div>
                    <p className="text-base font-semibold text-white">No map available</p>
                    <p className="text-sm text-slate-400">Upload a new image to restore the preview.</p>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4 rounded-[28px] border border-slate-700/70 bg-slate-900/40 p-5">
              <Button
                variant="outline"
                 className="w-full rounded-2xl border-rose-500/60 bg-transparent text-sm font-semibold text-rose-100 hover:bg-rose-500/10 disabled:border-slate-600 disabled:text-slate-500"
                onClick={handleDelete}
                disabled={!liveMap}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete published map
              </Button>
              {!liveMap && (
                <p className="text-xs uppercase tracking-[0.35em] text-rose-200">Map offline until next upload</p>
              )}
            </div>
          </div>
        </section>
      </div>
      <StaffFooter />
    </main>
  );
}
