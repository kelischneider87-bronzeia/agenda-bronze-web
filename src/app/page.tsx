import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#070403] text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-8 rounded-full border border-[#3a2a17] bg-black/40 px-6 py-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d7b56d]">
            Agenda Bronze
          </p>
        </div>

        <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">
          Agendamento premium para bronzeamento a jato.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-300 md:text-xl">
          Escolha abaixo se deseja solicitar seu horário de bronzeamento ou
          acessar o painel administrativo da equipe.
        </p>

        <div className="mt-10 grid w-full max-w-3xl gap-5 md:grid-cols-2">
          <Link
            href="/agendar-meu-bronze"
            className="group rounded-[2rem] border border-[#d7b56d] bg-[#d7b56d] p-8 text-left text-black shadow-2xl transition hover:-translate-y-1 hover:bg-[#f1d58a]"
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em]">
              Cliente
            </p>

            <h2 className="mt-4 text-3xl font-black">Agendar meu bronze</h2>

            <p className="mt-4 text-sm font-medium leading-relaxed text-black/70">
              Escolha serviço, data, horário e envie sua solicitação de
              agendamento para a equipe.
            </p>

            <div className="mt-8 font-bold">Começar agendamento →</div>
          </Link>

          <Link
            href="/dashboard"
            className="group rounded-[2rem] border border-[#3a2a17] bg-[#15100d] p-8 text-left shadow-2xl transition hover:-translate-y-1 hover:border-[#d7b56d]"
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d7b56d]">
              Equipe
            </p>

            <h2 className="mt-4 text-3xl font-black">Acessar painel</h2>

            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Área protegida para visualizar agenda, clientes, solicitações,
              financeiro e configurações.
            </p>

            <div className="mt-8 font-bold text-[#d7b56d]">
              Entrar no painel →
            </div>
          </Link>
        </div>

        <div className="mt-12 grid w-full max-w-5xl gap-4 md:grid-cols-3">
          <Card
            titulo="Agendamento online"
            texto="A cliente solicita o horário pela página pública e a equipe acompanha tudo no painel."
          />

          <Card
            titulo="Painel protegido"
            texto="Acesso administrativo com senha para manter os dados internos da equipe protegidos."
          />

          <Card
            titulo="Dados em tempo real"
            texto="Agenda, clientes e solicitações conectados ao Supabase para funcionar online."
          />
        </div>

        <p className="mt-12 text-xs text-zinc-600">
          Agenda Bronze © 2026 • Sistema premium para studios
        </p>
      </section>
    </main>
  );
}

function Card({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[#2a1d12] bg-[#100b08] p-6 text-left">
      <p className="text-sm font-bold text-[#d7b56d]">{titulo}</p>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{texto}</p>
    </div>
  );
}