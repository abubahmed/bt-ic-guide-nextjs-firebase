export function serialize(v: any): any {
  if (v && typeof v.toDate === "function") {
    try {
      return v.toDate().toISOString();
    } catch {}
  }

  if (typeof v === "function") return null;
  if (v === undefined) return null;
  if (Array.isArray(v)) return v.map(serialize);
  if (v && typeof v === "object") {
    const out: Record<string, any> = {};
    for (const [k, val] of Object.entries(v)) out[k] = serialize(val);
    return out;
  }

  return v;
}
