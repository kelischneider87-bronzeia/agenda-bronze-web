interface Props {
  titulo: string;
  subtitulo: string;
  onNovoAgendamento: () => void;
}

export default function AgendaHeader({
  titulo,
  subtitulo,
  onNovoAgendamento,
}: Props) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-5xl font-bold text-yellow-400">
          {titulo}
        </h1>

        <p className="mt-2 text-zinc-500">
          {subtitulo}
        </p>
      </div>

      <button
        onClick={onNovoAgendamento}
        className="rounded-2xl bg-yellow-400 px-6 py-4 font-semibold text-black transition-all hover:opacity-90"
      >
        + Novo Agendamento
      </button>
    </div>
  );
}