export default function NovoProtocoloPage() {
  return (
    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold text-yellow-500 mb-2">
          Novo Protocolo
        </h1>

        <p className="text-zinc-400 mb-10">
          Cadastre um novo protocolo premium.
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <input
              type="text"
              placeholder="Nome do protocolo"
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4"
            />

            <input
              type="text"
              placeholder="Valor"
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4"
            />

            <select className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4">
              <option>Intensidade</option>

              <option>Suave</option>
              <option>Média</option>
              <option>Intensa</option>
            </select>

            <select className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4">

              <option>Tempo de banho</option>

              <option>30 minutos</option>
              <option>1 hora</option>
              <option>1 hora e 30 minutos</option>
              <option>2 horas</option>
              <option>2 horas e 30 minutos</option>
              <option>3 horas</option>
              <option>3 horas e 30 minutos</option>
              <option>4 horas</option>
              <option>4 horas e 30 minutos</option>
              <option>5 horas</option>
              <option>5 horas e 30 minutos</option>
              <option>6 horas</option>
              <option>6 horas e 30 minutos</option>
              <option>7 horas</option>
              <option>7 horas e 30 minutos</option>
              <option>8 horas</option>

            </select>

            <input
              type="text"
              placeholder="Solução utilizada"
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 md:col-span-2"
            />

          </div>

          <textarea
            placeholder="Descrição do protocolo"
            className="w-full h-40 mt-6 bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-4"
          />

          <div className="flex items-center gap-4 mt-6">

            <input type="checkbox" />

            <span className="text-zinc-300">
              Protocolo ativo
            </span>

          </div>

          <button className="w-full bg-yellow-500 hover:bg-yellow-400 transition-all text-black font-bold py-5 rounded-2xl text-lg mt-10">
            Salvar Protocolo
          </button>

        </div>

      </div>

    </main>
  );
}