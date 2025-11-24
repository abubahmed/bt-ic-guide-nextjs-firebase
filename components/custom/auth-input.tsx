import { ThemeVariant, getTheme } from "@/lib/theme";
import { Input } from "../ui/input";

type AuthInputProps = {
  id: string;
  type: string;
  placeholder: string;
  autoComplete: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme?: ThemeVariant;
};

export default function AuthInput({ id, type, placeholder, autoComplete, value, onChange, theme = "attendee" }: AuthInputProps) {
  const palette = getTheme(theme);

  return (
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className={palette.form.input}
      value={value}
      onChange={onChange}
    />
  );
}
