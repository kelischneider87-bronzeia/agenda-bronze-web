export default function ClienteDetalhePage() {
  return (
    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold text-yellow-500 mb-2">
          Alexandra Thais Loureiro
        </h1>

        <p className="text-zinc-400 mb-10">
          Histórico completo da cliente.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400 mb-2">Fototipo</p>
            <h2 className="text-3xl font-bold">3</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400 mb-2">Subtom</p>
            <h2 className="text-3xl font-bold">Neutro</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400 mb-2">Atendimentos</p>
            <h2 className="text-3xl font-bold">12</h2>
          </div>

        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              Histórico de Atendimento
            </h2>

            <button className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-2xl hover:bg-yellow-400 transition">
              + Novo Atendimento
            </button>
          </div>

          <div className="space-y-6">

            <div className="bg-black border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">
                  Atendimento — 12/05/2026
                </h3>

                <span className="text-yellow-500 font-bold">
                  Bronze Premium
                </span>
              </div>

              <p className="text-zinc-300 mb-4">
                Pele bem hidratada. Excelente retenção do bronze.
                Utilizado protocolo Glow Bronze.
              </p>

              <div className="flex gap-3 flex-wrap">
                <span className="bg-zinc-800 px-4 py-2 rounded-xl text-sm">
                  Sem manchas
                </span>

                <span className="bg-zinc-800 px-4 py-2 rounded-xl text-sm">
                  Duração excelente
                </span>

                <span className="bg-zinc-800 px-4 py-2 rounded-xl text-sm">
                  Cliente satisfeita
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}