// main.ts
import { Application } from "./deps.ts";
import { responseMiddleware } from "./middleware/response.ts";
import { createAuthRoutes } from "./modules/Authentication/routes.ts";
import { createIngredientRoutes } from "./modules/Ingredient/routes.ts";
import { AuthenticationService } from "./modules/Authentication/service.ts";
import { IngredientService } from "./modules/Ingredient/service.ts";
import { AuthenticationRepository } from "./modules/Authentication/repository.ts";
import { IngredientRepository } from "./modules/Ingredient/repository.ts";
import { UserService } from "./modules/User/service.ts";
import { UserRepository } from "./modules/User/repository.ts";
import { AuthenticationController } from "./modules/Authentication/controller.ts";
import { IngredientController } from "./modules/Ingredient/controller.ts";

const app = new Application();

// Initialize repositories
const authRepository = new AuthenticationRepository();
const ingredientRepository = new IngredientRepository();
const userRepository = new UserRepository();

// Initialize services
const userService = new UserService(userRepository);
const authService = new AuthenticationService(authRepository, userService);
const ingredientService = new IngredientService(ingredientRepository);

// Initialize controllers
const authController = new AuthenticationController(authService);
const ingredientController = new IngredientController(ingredientService);

// Initialize routes
const authRoutes = createAuthRoutes(authController);
const ingredientRoutes = createIngredientRoutes(ingredientController);

// Global middleware
app.use(responseMiddleware);

// Error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error: unknown) {
    const err = error as {
      status?: number;
      message?: string;
      details?: unknown;
    };
    ctx.response.status = err.status || 500;
    ctx.response.body = {
      success: false,
      message: err.message || "Internal Server Error",
      details: err.details,
    };
  }
});

// Routes
app.use(authRoutes.routes());
app.use(authRoutes.allowedMethods());
app.use(ingredientRoutes.routes());
app.use(ingredientRoutes.allowedMethods());

// Start server
const port = 8000;
console.log(`Server running on http://localhost:${port}`);
await app.listen({ port });
