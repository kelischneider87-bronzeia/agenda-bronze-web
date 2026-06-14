import { NextRequest, NextResponse } from "next/server";

const ROTAS_PROTEGIDAS = [
  "/dashboard",
  "/agenda",
  "/clientes",
  "/novo-cliente",
  "/novo-agendamento",
  "/editar-agendamento",
  "/novo-protocolo",
  "/protocolos",
];

function rotaProtegida(pathname: string) {
  return ROTAS_PROTEGIDAS.some(
    (rota) => pathname === rota || pathname.startsWith(`${rota}/`)
  );
}

async function gerarToken(senha: string, segredo: string) {
  const texto = new TextEncoder().encode(`${senha}|${segredo}`);
  const hash = await crypto.subtle.digest("SHA-256", texto);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!rotaProtegida(pathname)) {
    return NextResponse.next();
  }

  const senhaAdmin = process.env.ADMIN_PASSWORD;
  const segredo = process.env.AUTH_SECRET || "agenda-bronze-segredo-local";

  if (!senhaAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("erro", "senha_nao_configurada");
    return NextResponse.redirect(url);
  }

  const tokenCookie = request.cookies.get("agenda_bronze_admin")?.value;
  const tokenEsperado = await gerarToken(senhaAdmin, segredo);

  if (tokenCookie === tokenEsperado) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("from", `${pathname}${request.nextUrl.search}`);

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/agenda/:path*",
    "/clientes/:path*",
    "/novo-cliente/:path*",
    "/novo-agendamento/:path*",
    "/editar-agendamento/:path*",
    "/novo-protocolo/:path*",
    "/protocolos/:path*",
  ],
};