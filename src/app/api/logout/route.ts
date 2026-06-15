import { NextResponse } from "next/server";

export async function POST() {
  const resposta = NextResponse.json({
    ok: true,
    mensagem: "Logout realizado.",
  });

  resposta.cookies.set("agenda_bronze_admin", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return resposta;
}