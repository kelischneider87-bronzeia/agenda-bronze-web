type Props = {

  placeholder?: string;

  value?: string;

  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  type?: string;

  className?: string;
};

export default function Input({
  placeholder,
  value,
  onChange,
  type = "text",
  className = "",
}: Props) {

  return (

    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`
        w-full h-14
        rounded-2xl
        bg-black
        border border-zinc-900
        px-5
        text-lg
        outline-none

        focus:border-yellow-500/40
        transition-all

        ${className}
      `}
    />
  );
}