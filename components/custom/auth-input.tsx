import { Input } from "../ui/input";

export default function AuthInput({
  id,
  type,
  placeholder,
  autoComplete,
  value,
  onChange,
  staff,
}: {
  id: string;
  type: string;
  placeholder: string;
  autoComplete: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  staff: boolean;
}) {
  return (
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className={
        !staff
          ? "h-11 rounded-xl border border-sky-100 bg-white text-black placeholder:text-sky-700 focus:border-sky-300 focus-visible:ring-sky-400"
          : "h-11 rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus-visible:ring-sky-400/40"
      }
      value={value}
      onChange={onChange}
    />
  );
}
