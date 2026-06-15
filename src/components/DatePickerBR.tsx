"use client";

import { useRef } from "react";

type DatePickerBRProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  min?: string;
};

function brParaIso(dataBR: string) {
  if (!dataBR) return "";

  const partes = dataBR.split("/");

  if (partes.length !== 3) return "";

  const [dia, mes, ano] = partes;

  if (!dia || !mes || !ano) return "";

  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
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
        {value || "Selecione a data"}
      </button>

      <input
        ref={inputRef}
        type="date"
        value={brParaIso(value)}
        min={min ? brParaIso(min) : undefined}
        onChange={(event) => onChange(isoParaBr(event.target.value))}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}