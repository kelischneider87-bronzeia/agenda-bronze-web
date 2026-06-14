export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full border-b border-[#D4AF37]/20 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-[#D4AF37]">
            Agenda Bronze
          </h1>

          <nav className="hidden gap-8 text-sm text-gray-300 md:flex">
            <a href="#">Início</a>
            <a href="#">Recursos</a>
            <a href="#">Planos</a>
            <a href="#">Contato</a>
          </nav>

          <button className="rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-semibold text-black transition hover:scale-105">
            Entrar
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        {/* Glow */}
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-20 md:grid-cols-2">
          {/* Texto */}
          <div>
            <span className="mb-4 inline-block rounded-full border border-[#D4AF37]/30 px-4 py-2 text-sm text-[#D4AF37]">
              Plataforma Premium para Bronzeamento a Jato
            </span>

            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
              Gerencie seu studio com mais organização e autoridade.
            </h1>

            <p className="mb-10 max-w-xl text-lg text-gray-400">
              Agenda, clientes, financeiro, protocolos e automações em uma
              única plataforma criada especialmente para profissionais do
              bronzeamento a jato.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="rounded-full bg-[#D4AF37] px-8 py-4 font-semibold text-black transition hover:scale-105">
                Começar Agora
              </button>

              <button className="rounded-full border border-[#D4AF37] px-8 py-4 font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black">
                Ver Demonstração
              </button>
            </div>
          </div>

          {/* Mockup */}
          <div className="relative">
            <div className="rounded-[30px] border border-[#D4AF37]/20 bg-gradient-to-b from-[#1A1A1A] to-black p-6 shadow-2xl shadow-[#D4AF37]/10">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Próximo Atendimento</p>
                  <h3 className="text-2xl font-bold">
                    Cliente Premium
                  </h3>
                </div>

                <div className="rounded-full bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black">
                  14:30
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-gray-400">Faturamento Mensal</p>
                  <h3 className="text-3xl font-bold text-[#D4AF37]">
                    R$ 12.480
                  </h3>
                </div>

                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-gray-400">
                    Clientes Atendidas
                  </p>
                  <h3 className="text-3xl font-bold">
                    184
                  </h3>
                </div>

                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-gray-400">
                    Agenda da Semana
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-black/40 p-3">
                      <span>Amanda</span>
                      <span className="text-[#D4AF37]">09:00</span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-black/40 p-3">
                      <span>Fernanda</span>
                      <span className="text-[#D4AF37]">11:30</span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-black/40 p-3">
                      <span>Juliana</span>
                      <span className="text-[#D4AF37]">14:30</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}