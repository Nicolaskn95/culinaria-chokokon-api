import { Router } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { ProductsController } from "./ProductsController.ts";

const ProductsRouter = new Router();
const productsController = new ProductsController();

ProductsRouter.post("/products", async (context) => {
  await productsController.create(context.request, context.response);
});

ProductsRouter.get("/products", async (context) => {
  await productsController.findAll(context.request, context.response);
});

ProductsRouter.get("/products/:id", async (context) => {
  await productsController.findById(context.request, context.response);
});

ProductsRouter.put("/products/:id", async (context) => {
  await productsController.update(context.request, context.response);
});

ProductsRouter.delete("/products/:id", async (context) => {
  await productsController.delete(context.request, context.response);
});

export { ProductsRouter };
