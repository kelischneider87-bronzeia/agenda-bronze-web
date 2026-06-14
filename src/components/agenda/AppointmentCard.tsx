interface Props {
  cliente: string;
  valor: number;
  status: string;
}

export default function AppointmentCard({
  cliente,
  valor,
  status,
}: Props) {

  function corStatus(status: string) {

    if (status === "Confirmado") {
      return "bg-green-500/10 border-green-500/40";
    }

    if (status === "Pendente") {
      return "bg-yellow-500/10 border-yellow-500/40";
    }

    if (status === "Finalizado") {
      return "bg-blue-500/10 border-blue-500/40";
    }

    if (status === "Cancelado") {
      return "bg-red-500/10 border-red-500/40";
    }

    return "bg-zinc-500/10 border-zinc-500/40";
  }

  return (

    <div
      className={`flex h-full flex-col justify-center rounded-xl border px-2 transition-all hover:scale-[1.01] hover:shadow-lg ${corStatus(
        status
      )}`}
    >

      {/* CLIENTE */}

      <h2 className="truncate text-[10px] font-semibold text-white">

        {cliente}

      </h2>

      {/* VALOR */}

      <p className="text-[9px] text-zinc-400">

        R$ {Number(valor).toFixed(2)}

      </p>

    </div>
  );
}