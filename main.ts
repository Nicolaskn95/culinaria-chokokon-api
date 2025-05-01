// main.ts
import { Application } from "./deps.ts";
import { connectDB } from "./db/connect.ts";

// Configuração inicial
const PORT = 8000;
const app = new Application();

// Conectar ao MongoDB
await connectDB();

// Middleware básico
app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  await next();
});

// Rota de teste
app.use((ctx) => {
  ctx.response.body = "API de Precificação Culinária Online!";
});

console.log(`Servidor rodando em http://localhost:${PORT}`);
await app.listen({ port: PORT });