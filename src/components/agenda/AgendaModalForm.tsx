interface Props {
  cliente: string;
  valor: string;
  status: string;
  sinal: string;
  pago: boolean;
  formaPagamento: string;
  observacoes: string;
  data: string;
  hora: string;
  onClienteChange: (value: string) => void;
  onValorChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSinalChange: (value: string) => void;
  onPagoChange: (value: boolean) => void;
  onFormaPagamentoChange: (value: string) => void;
  onObservacoesChange: (value: string) => void;
  onDataChange: (value: string) => void;
  onHoraChange: (value: string) => void;
  onSalvar: () => void;
  onExcluir?: () => void;
  modoEdicao?: boolean;
}

export default function AgendaModalForm({
  cliente,
  valor,
  status,
  sinal,
  pago,
  formaPagamento,
  observacoes,
  data,
  hora,
  onClienteChange,
  onValorChange,
  onStatusChange,
  onSinalChange,
  onPagoChange,
  onFormaPagamentoChange,
  onObservacoesChange,
  onDataChange,
  onHoraChange,
  onSalvar,
  onExcluir,
  modoEdicao = false,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Data
          </label>

          <input
            type="date"
            value={data}
            onChange={(e) => onDataChange(e.target.value)}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white outline-none focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Hora
          </label>

          <input
            type="time"
            value={hora}
            onChange={(e) => onHoraChange(e.target.value)}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white outline-none focus:border-yellow-400"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Cliente
        </label>

        <input
          type="text"
          value={cliente}
          onChange={(e) => onClienteChange(e.target.value)}
          placeholder="Nome da cliente"
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white outline-none focus:border-yellow-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Valor do Atendimento
        </label>

        <input
          type="number"
          value={valor}
          onChange={(e) => onValorChange(e.target.value)}
          placeholder="149"
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white outline-none focus:border-yellow-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Sinal / Entrada
        </label>

        <input
          type="number"
          value={sinal}
          onChange={(e) => onSinalChange(e.target.value)}
          placeholder="0"
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white outline-none focus:border-yellow-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Forma de Pagamento
        </label>

        <select
          value={formaPagamento}
          onChange={(e) => onFormaPagamentoChange(e.target.value)}
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white outline-none focus:border-yellow-400"
        >
          <option value="">Selecione</option>
          <option value="Pix">Pix</option>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão de Crédito">Cartão de Crédito</option>
          <option value="Cartão de Débito">Cartão de Débito</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Status
        </label>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white outline-none focus:border-yellow-400"
        >
          <option>Confirmado</option>
          <option>Pendente</option>
          <option>Finalizado</option>
          <option>Cancelado</option>
        </select>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4">
        <div>
          <p className="text-sm font-medium text-white">
            Pagamento quitado
          </p>
          <p className="text-xs text-zinc-500">
            Marque quando o atendimento estiver pago.
          </p>
        </div>

        <input
          type="checkbox"
          checked={pago}
          onChange={(e) => onPagoChange(e.target.checked)}
          className="h-5 w-5 accent-yellow-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Observações
        </label>

        <textarea
          value={observacoes}
          onChange={(e) => onObservacoesChange(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white outline-none focus:border-yellow-400"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={onSalvar}
          className="flex-1 rounded-2xl bg-yellow-400 py-4 font-semibold text-black transition-all hover:opacity-90"
        >
          {modoEdicao ? "Salvar Alterações" : "Salvar Agendamento"}
        </button>

        {modoEdicao && onExcluir && (
          <button
            onClick={onExcluir}
            className="rounded-2xl border border-red-500 px-6 py-4 font-semibold text-red-400 transition-all hover:bg-red-500/10"
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}