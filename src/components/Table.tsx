type Props = {

  headers: string[];

  children: React.ReactNode;
};

export default function Table({
  headers,
  children,
}: Props) {

  return (

    <div
      className="
        bg-zinc-950
        border border-zinc-900
        rounded-3xl
        overflow-hidden
      "
    >

      {/* HEADER */}
      <div
        className="
          grid
          border-b border-zinc-900
          bg-black
        "
        style={{
          gridTemplateColumns:
            `repeat(${headers.length}, minmax(0, 1fr))`,
        }}
      >

        {headers.map((header) => (

          <div
            key={header}
            className="
              px-6 py-4
              text-sm font-bold
              text-zinc-400
            "
          >

            {header}

          </div>

        ))}

      </div>

      {/* BODY */}
      <div>

        {children}

      </div>

    </div>
  );
}