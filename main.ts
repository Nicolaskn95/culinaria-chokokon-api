import { Application } from "https://deno.land/x/oak/mod.ts";
import { Env } from "./config/Env.ts";
import { Print } from "./globals/output/Print.ts";
import { UnauthRouter } from "./routes/UnauthRouter.ts";
import { ChokokonDB } from "./database/db/connect.ts";

const print = new Print();

print.info("Starting server...");
const app = new Application();

// Verify database connection
try {
  print.info("Connecting to MongoDB...");
  ChokokonDB.on("error", (error) => {
    print.error(`MongoDB connection error: ${error}`);
    Deno.exit(1);
  });

  ChokokonDB.on("disconnected", () => {
    print.error("MongoDB disconnected");
    Deno.exit(1);
  });

  ChokokonDB.on("connected", () => {
    print.success("MongoDB connected successfully");
  });
} catch (error) {
  print.error(`Failed to connect to MongoDB: ${error}`);
  Deno.exit(1);
}

// Oak has built-in security headers
print.info("Setting up security headers...");
app.use(async (ctx, next) => {
  ctx.response.headers.set("X-Content-Type-Options", "nosniff");
  ctx.response.headers.set("X-Frame-Options", "DENY");
  ctx.response.headers.set("X-XSS-Protection", "1; mode=block");
  await next();
});

// print.info("Setting up static file serving...");
// app.use(async (ctx, next) => {
//   try {
//     await ctx.send({
//       root: `${Deno.cwd()}/public`,
//       index: "index.html",
//     });
//   } catch {
//     await next();
//   }
// });

print.info("Setting up unauth router...");
// router.use("/unauth", UnauthRouter.routes(), UnauthRouter.allowedMethods());

print.info("Setting up auth router...");
app.use(UnauthRouter.routes());
app.use(UnauthRouter.allowedMethods());

print.info("Setting up API router...");
// app.use(APIRouter);

// Oak has built-in CORS support
print.info("Setting up CORS...");
app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  ctx.response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  ctx.response.type = "application/json";
  await next();
});

print.info("Setting up error handler...");
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error: unknown) {
    console.error(error);
    const err = error as { status?: number; message?: string };
    ctx.response.status = err.status || 500;
    ctx.response.body = {
      error: err.message || "Internal Server Error",
    };
  }
});

if (app) {
  print.info("Starting WEB Server...");
  await app.listen({ port: Env.serverPort });
  print.info(`
    Back-end is running on port ${Env.ip}:${Env.serverPort} (${Env.name})
    `);
}
