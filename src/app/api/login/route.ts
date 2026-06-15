import { NextRequest, NextResponse } from "next/server";

async function gerarToken(senha: string, segredo: string) {
  const texto = new TextEncoder().encode(`${senha}|${segredo}`);
  const hash = await crypto.subtle.digest("SHA-256", texto);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const senhaDigitada = String(body?.senha || "");

    const senhaAdmin = process.env.ADMIN_PASSWORD;
    const segredo = process.env.AUTH_SECRET || "agenda-bronze-segredo-local";

    if (!senhaAdmin) {
      return NextResponse.json(
        { erro: "ADMIN_PASSWORD não foi configurada na Vercel." },
        { status: 500 }
      );
    }

    if (!senhaDigitada) {
      return NextResponse.json(
        { erro: "Digite a senha administrativa." },
        { status: 400 }
      );
    }

    if (senhaDigitada !== senhaAdmin) {
      return NextResponse.json({ erro: "Senha inválida." }, { status: 401 });
    }

    const token = await gerarToken(senhaAdmin, segredo);

    const resposta = NextResponse.json({
      ok: true,
      mensagem: "Login realizado com sucesso.",
    });

    resposta.cookies.set("agenda_bronze_admin", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return resposta;
  } catch {
    return NextResponse.json(
      { erro: "Não foi possível processar o login." },
      { status: 500 }
    );
  }
}