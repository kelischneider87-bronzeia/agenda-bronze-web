type Props = {

  children: React.ReactNode;

  className?: string;
};

export default function Card({
  children,
  className = "",
}: Props) {

  return (

    <div
      className={`
        bg-zinc-950
        border border-zinc-900
        rounded-3xl
        p-6

        ${className}
      `}
    >

      {children}

    </div>
  );
}