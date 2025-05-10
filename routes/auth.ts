// routes/auth.ts
import { Router } from "https://deno.land/x/oak/mod.ts";
import { Usuario } from "../models/Usuario.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { create, verify } from "https://deno.land/x/djwt/mod.ts";

const router = new Router();
const JWT_SECRET = Deno.env.get("JWT_SECRET") || "seu_segredo_super_secreto";

// Rota de login
router.post("/auth/login", async (ctx) => {
  const { email, senha } = await ctx.request.body.json();

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Credenciais inválidas" };
      return;
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Credenciais inválidas" };
      return;
    }

    const token = await create(
      { alg: "HS512", typ: "JWT" },
      {
        sub: usuario._id.toString(),
        email: usuario.email,
        name: usuario.nome,
        role: usuario.tipoUsuario,
      },
      JWT_SECRET
    );

    ctx.response.body = {
      token,
      user: {
        id: usuario._id,
        name: usuario.nome,
        email: usuario.email,
        role: usuario.tipoUsuario,
      },
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Erro no servidor" };
  }
});

// Rota para obter informações do usuário (usada pelo NextAuth para sessão)
router.get("/api/auth/session", async (ctx) => {
  const authHeader = ctx.request.headers.get("Authorization");
  if (!authHeader) {
    ctx.response.status = 401;
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = await verify(token, JWT_SECRET, "HS512");
    const usuario = await Usuario.findById(payload.sub);

    if (!usuario) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Usuário não encontrado" };
      return;
    }

    ctx.response.body = {
      user: {
        id: usuario._id,
        name: usuario.nome,
        email: usuario.email,
        role: usuario.tipoUsuario,
      },
    };
  } catch (error) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Token inválido" };
  }
});

export default router;
