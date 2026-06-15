"use client";

type DatePickerBRProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  min?: string;
  disabled?: boolean;
};

export default function DatePickerBR({
  value,
  onChange,
  className,
  min,
  disabled = false,
}: DatePickerBRProps) {
  return (
    <input
      type="date"
      value={value || ""}
      min={min}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className={
        className ||
        "w-full rounded-2xl border border-zinc-700 bg-black px-4 py-4 text-white outline-none transition focus:border-[#d7b56d] disabled:cursor-not-allowed disabled:opacity-60"
      }
    />
  );
}
