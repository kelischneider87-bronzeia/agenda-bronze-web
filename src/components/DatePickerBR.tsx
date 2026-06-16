"use client";

import { useRef } from "react";

type DatePickerBRProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  min?: string;
  placeholder?: string;
};

function valorParaIso(valor: string) {
  if (!valor) return "";

  const valorLimpo = valor.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(valorLimpo)) {
    return valorLimpo;
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(valorLimpo)) {
    const [dia, mes, ano] = valorLimpo.split("/");
    return `${ano}-${mes}-${dia}`;
  }

  return "";
}

function valorParaBR(valor: string) {
  if (!valor) return "";

  const valorLimpo = valor.trim();

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(valorLimpo)) {
    return valorLimpo;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(valorLimpo)) {
    const [ano, mes, dia] = valorLimpo.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  return valorLimpo;
}

function isoParaBR(valorIso: string) {
  if (!valorIso) return "";

  const [ano, mes, dia] = valorIso.split("-");

  if (!ano || !mes || !dia) return "";

  return `${dia}/${mes}/${ano}`;
}

export default function DatePickerBR({
  value,
  onChange,
  className,
  min,
  placeholder = "Selecione a data",
}: DatePickerBRProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const valorIso = valorParaIso(value);
  const valorBR = valorParaBR(value);
  const minIso = min ? valorParaIso(min) : undefined;

  function abrirCalendario() {
    const input = inputRef.current;

    if (!input) return;

    try {
      input.showPicker();
    } catch {
      input.focus();
      input.click();
    }
  }

  function alterarData(valorIsoSelecionado: string) {
    const dataBR = isoParaBR(valorIsoSelecionado);
    onChange(dataBR);
  }

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={abrirCalendario}
        className={
          className ||
          "w-full rounded-2xl border border-[#d7b56d] bg-black px-4 py-4 text-left font-semibold text-white outline-none transition hover:border-[#f1d58a] focus:border-[#f1d58a]"
        }
      >
        {valorBR || placeholder}
      </button>

      <input
        ref={inputRef}
        type="date"
        value={valorIso}
        min={minIso}
        onChange={(event) => alterarData(event.target.value)}
        className="absolute left-0 top-0 h-px w-px opacity-0"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}