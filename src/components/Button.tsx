type Props = {

  children: React.ReactNode;

  onClick?: () => void;

  className?: string;

  variant?: "primary" | "secondary" | "danger";
};

export default function Button({
  children,
  onClick,
  className = "",
  variant = "primary",
}: Props) {

  const variants = {

    primary:
      "bg-yellow-500 hover:bg-yellow-400 text-black",

    secondary:
      "bg-zinc-900 hover:bg-zinc-800 text-white",

    danger:
      "bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500",
  };

  return (

    <button
      onClick={onClick}
      className={`
        h-14 px-6 rounded-2xl
        transition-all
        font-bold text-lg

        ${variants[variant]}

        ${className}
      `}
    >

      {children}

    </button>
  );
}