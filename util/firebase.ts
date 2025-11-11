import { Timestamp } from "firebase-admin/firestore";

export function serialize(v: any): any {
  if (v instanceof Timestamp) return v.toDate().toISOString();
  if (Array.isArray(v)) return v.map(serialize);
  if (v && typeof v === "object") {
    const out: Record<string, any> = {};
    for (const [k, x] of Object.entries(v)) out[k] = serialize(x);
    return out;
  }
  return v;
}
