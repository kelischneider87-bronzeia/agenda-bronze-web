"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

type Toast = {

  id: number;

  mensagem: string;

  tipo:
    | "success"
    | "error";
};

type ToastContextType = {

  showToast: (
    mensagem: string,
    tipo?: "success" | "error"
  ) => void;
};

const ToastContext =
  createContext<ToastContextType | null>(
    null
  );

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [toasts, setToasts] =
    useState<Toast[]>([]);

  function showToast(
    mensagem: string,
    tipo:
      | "success"
      | "error" = "success"
  ) {

    const id = Date.now();

    setToasts((prev) => [
      ...prev,
      {
        id,
        mensagem,
        tipo,
      },
    ]);

    setTimeout(() => {

      setToasts((prev) =>
        prev.filter(
          (toast) =>
            toast.id !== id
        )
      );

    }, 3000);
  }

  return (

    <ToastContext.Provider
      value={{
        showToast,
      }}
    >

      {children}

      {/* TOASTS */}
      <div
        className="
          fixed top-5 right-5
          z-[9999]
          flex flex-col gap-3
        "
      >

        {toasts.map((toast) => (

          <div
            key={toast.id}
            className={`
              min-w-[320px]
              px-5 py-4
              rounded-2xl
              border
              shadow-2xl
              backdrop-blur-sm
              animate-[fadeIn_.2s_ease]

              ${
                toast.tipo ===
                "success"
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }
            `}
          >

            <p className="font-semibold">

              {toast.mensagem}

            </p>

          </div>

        ))}

      </div>

    </ToastContext.Provider>
  );
}

export function useToast() {

  const context =
    useContext(ToastContext);

  if (!context) {

    throw new Error(
      "useToast deve ser usado dentro do ToastProvider"
    );
  }

  return context;
}