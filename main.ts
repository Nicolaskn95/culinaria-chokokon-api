// main.ts
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { connectDB } from "./db/connect.ts";
import routes from "./routes/index.ts";

const PORT = 8000;
const app = new Application();
const router = new Router();

// Conectar ao MongoDB
await connectDB().catch((err) => {
  console.error("DB connection failed:", err);
  Deno.exit(1);
});

// Middlewares
app.use(async (ctx, next) => {
  // Logger
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.request.method} ${ctx.request.url.pathname} - ${ms}ms`);
});

app.use(async (ctx, next) => {
  // CORS
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 204;
    return;
  }

  await next();
});

// Error handler
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = { error: "Server error" };
    console.error(err);
  }
});

// Implement routes
routes.forEach((route) => {
  app.use(route.routes());
  app.use(route.allowedMethods());
});

// Test route
router.get("/", (ctx) => {
  ctx.response.body = "API de Precificação Culinária Online!";
});

console.log(`Servidor rodando em http://localhost:${PORT}`);
await app.listen({ port: PORT });
