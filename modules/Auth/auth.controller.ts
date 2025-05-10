// import { Context } from "https://deno.land/x/oak/mod.ts";
// import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
// import { create, verify } from "https://deno.land/x/djwt/mod.ts";
// import { Usuario } from "../../db/models/Usuario.ts";

// const JWT_SECRET = Deno.env.get("JWT_SECRET") || "seu_segredo_super_secreto";
// const REFRESH_TOKEN_SECRET =
//   Deno.env.get("REFRESH_TOKEN_SECRET") || "seu_refresh_token_secreto";

// export class AuthController {
//   async login(ctx: Context) {
//     try {
//       const { email, senha } = await ctx.request.body.json();

//       // Find user using Mongoose
//       const usuario = await Usuario.findOne({ email }).exec();

//       if (!usuario) {
//         ctx.response.status = 401;
//         ctx.response.body = { message: "Credenciais inválidas" };
//         return;
//       }

//       const senhaValida = await bcrypt.compare(senha, usuario.senha);
//       if (!senhaValida) {
//         ctx.response.status = 401;
//         ctx.response.body = { message: "Credenciais inválidas" };
//         return;
//       }

//       // Generate access token
//       const accessToken = await create(
//         { alg: "HS512", typ: "JWT" },
//         {
//           sub: usuario._id.toString(),
//           email: usuario.email,
//           name: usuario.nome,
//           role: usuario.tipoUsuario,
//         },
//         JWT_SECRET
//       );

//       // Generate refresh token
//       const refreshToken = await create(
//         { alg: "HS512", typ: "JWT" },
//         {
//           sub: usuario._id.toString(),
//           type: "refresh",
//         },
//         REFRESH_TOKEN_SECRET
//       );

//       ctx.response.body = {
//         accessToken,
//         refreshToken,
//         user: {
//           id: usuario._id,
//           name: usuario.nome,
//           email: usuario.email,
//           role: usuario.tipoUsuario,
//         },
//       };
//     } catch (error) {
//       console.error("Login error:", error);
//       ctx.response.status = 500;
//       ctx.response.body = { message: "Erro no servidor" };
//     }
//   }

//   async refreshToken(ctx: Context) {
//     try {
//       const { refreshToken } = await ctx.request.body.json();

//       if (!refreshToken) {
//         ctx.response.status = 400;
//         ctx.response.body = { message: "Refresh token é obrigatório" };
//         return;
//       }

//       const payload = await verify(refreshToken, REFRESH_TOKEN_SECRET, "HS512");

//       if (payload.type !== "refresh") {
//         ctx.response.status = 401;
//         ctx.response.body = { message: "Token inválido" };
//         return;
//       }

//       // Find user using Mongoose
//       const usuario = await Usuario.findById(payload.sub).exec();

//       if (!usuario) {
//         ctx.response.status = 404;
//         ctx.response.body = { message: "Usuário não encontrado" };
//         return;
//       }

//       // Generate new access token
//       const accessToken = await create(
//         { alg: "HS512", typ: "JWT" },
//         {
//           sub: usuario._id.toString(),
//           email: usuario.email,
//           name: usuario.nome,
//           role: usuario.tipoUsuario,
//         },
//         JWT_SECRET
//       );

//       ctx.response.body = {
//         accessToken,
//         user: {
//           id: usuario._id,
//           name: usuario.nome,
//           email: usuario.email,
//           role: usuario.tipoUsuario,
//         },
//       };
//     } catch (error) {
//       console.error("Refresh token error:", error);
//       ctx.response.status = 401;
//       ctx.response.body = { message: "Token inválido" };
//     }
//   }

//   async verify(ctx: Context) {
//     try {
//       const authHeader = ctx.request.headers.get("Authorization");
//       if (!authHeader) {
//         ctx.response.status = 401;
//         ctx.response.body = { message: "Token não fornecido" };
//         return;
//       }

//       const token = authHeader.split(" ")[1];
//       const payload = await verify(token, JWT_SECRET, "HS512");

//       // Find user using Mongoose
//       const usuario = await Usuario.findById(payload.sub).exec();

//       if (!usuario) {
//         ctx.response.status = 404;
//         ctx.response.body = { message: "Usuário não encontrado" };
//         return;
//       }

//       ctx.response.body = {
//         user: {
//           id: usuario._id,
//           name: usuario.nome,
//           email: usuario.email,
//           role: usuario.tipoUsuario,
//         },
//       };
//     } catch (error) {
//       console.error("Verify token error:", error);
//       ctx.response.status = 401;
//       ctx.response.body = { message: "Token inválido" };
//     }
//   }
// }
