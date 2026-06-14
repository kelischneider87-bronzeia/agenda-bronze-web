type Props = {

  titulo: string;

  subtitulo?: string;

  botao?: React.ReactNode;
};

export default function PageHeader({
  titulo,
  subtitulo,
  botao,
}: Props) {

  return (

    <div
      className="
        flex items-start justify-between
        mb-8
      "
    >

      <div>

        <h1
          className="
            text-5xl font-bold
            text-yellow-500
            mb-2
          "
        >

          {titulo}

        </h1>

        {subtitulo && (

          <p className="text-zinc-500 text-lg">

            {subtitulo}

          </p>

        )}

      </div>

      {botao}

    </div>
  );
}