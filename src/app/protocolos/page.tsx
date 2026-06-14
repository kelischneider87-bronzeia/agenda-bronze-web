export default function ProtocolosPage() {
  return (
    <main className="min-h-screen bg-black text-white flex">

      {/* MENU */}

      <aside className="w-72 bg-zinc-950 border-r border-yellow-500/10 p-6">

        <h1 className="text-3xl font-bold text-yellow-500 mb-10">
          Agenda Bronze
        </h1>

        <nav className="flex flex-col gap-4">

          <button className="bg-zinc-900 py-3 rounded-xl">
            Dashboard
          </button>

          <button className="bg-zinc-900 py-3 rounded-xl">
            Clientes
          </button>

          <button className="bg-zinc-900 py-3 rounded-xl">
            Agenda
          </button>

          <button className="bg-zinc-900 py-3 rounded-xl">
            Financeiro
          </button>

          <button className="bg-yellow-500 text-black py-3 rounded-xl font-semibold">
            Protocolos
          </button>

        </nav>

      </aside>

      {/* CONTEÚDO */}

      <section className="flex-1 p-10">

        <div className="flex items-center justify-between mb-10">

          <div>
            <h2 className="text-5xl font-bold mb-2">
              Protocolos
            </h2>

            <p className="text-zinc-400">
              Gerencie os protocolos do seu studio.
            </p>
          </div>

          <button className="bg-yellow-500 text-black px-6 py-4 rounded-2xl font-bold">
            + Novo Protocolo
          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CARD */}

          <div className="bg-zinc-950 border border-yellow-500/10 rounded-3xl p-6">

            <div className="flex items-center justify-between mb-6">

              <h3 className="text-2xl font-bold">
                Bronze Intenso
              </h3>

              <span className="bg-yellow-500 text-black px-3 py-1 rounded-xl text-sm font-bold">
                8h
              </span>

            </div>

            <p className="text-zinc-400 mb-6">
              Bronze intenso com alta profundidade de cor e longa duração.
            </p>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Valor
                </span>

                <span className="font-bold text-yellow-500">
                  R$ 149
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Intensidade
                </span>

                <span>
                  Alta
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Solução
                </span>

                <span>
                  Glow Dark
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}