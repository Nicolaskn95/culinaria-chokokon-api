// // routes/auth.ts
// import { Router } from "https://deno.land/x/oak/mod.ts";
// import { AuthController } from "./auth.controller.ts";

// const router = new Router();
// const authController = new AuthController();

// // Login route
// router.post("/auth/login", (ctx) => authController.login(ctx));

// // Refresh token route
// router.post("/auth/refresh", (ctx) => authController.refreshToken(ctx));

// // Verify token route
// router.get("/auth/verify", (ctx) => authController.verify(ctx));

// export default router;

// export const config = {
//   port: Deno.env.get("PORT") || 8000,
//   jwtSecret: Deno.env.get("JWT_SECRET"),
//   refreshTokenSecret: Deno.env.get("REFRESH_TOKEN_SECRET"),
//   mongoUri: Deno.env.get("MONGO_URI"),
//   environment: Deno.env.get("NODE_ENV") || "development",
// };
