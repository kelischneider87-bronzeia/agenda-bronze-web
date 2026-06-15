"use client";

import { useRef } from "react";

type DatePickerBRProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  min?: string;
};

function valorParaIso(valor: string) {
  if (!valor) return "";

  // Já está no formato ISO: 2026-06-15
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return valor;
  }

  // Está no formato BR: 15/06/2026
  const partes = valor.split("/");

  if (partes.length !== 3) return "";

  const [dia, mes, ano] = partes;

  if (!dia || !mes || !ano) return "";

  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}

function valorParaBR(valor: string) {
  if (!valor) return "";

  // Está no formato ISO: 2026-06-15
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    const [ano, mes, dia] = valor.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  // Já está no formato BR: 15/06/2026
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
    return valor;
  }

  return valor;
}

function isoParaBr(dataIso: string) {
  if (!dataIso) return "";

  const partes = dataIso.split("-");

  if (partes.length !== 3) return "";

  const [ano, mes, dia] = partes;

  return `${dia}/${mes}/${ano}`;
}

export default function DatePickerBR({
  value,
  onChange,
  className,
  min,
}: DatePickerBRProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

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

  const valorIso = valorParaIso(value);
  const valorBR = valorParaBR(value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={abrirCalendario}
        className={
          className ||
          "w-full rounded-2xl border border-zinc-700 bg-black px-4 py-4 text-left text-white outline-none transition focus:border-[#d7b56d]"
        }
      >
        {valorBR || "Selecione a data"}
      </button>

      <input
        ref={inputRef}
        type="date"
        value={valorIso}
        min={min ? valorParaIso(min) : undefined}
        onChange={(event) => onChange(isoParaBr(event.target.value))}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}