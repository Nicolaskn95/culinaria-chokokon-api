import { Router } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { CustomerController } from "./CustomerController.ts";

const CustomerRouter = new Router();
const customerController = new CustomerController();

CustomerRouter.post("/customers", async (context) => {
  await customerController.create(context.request, context.response);
});

CustomerRouter.get("/customers", async (context) => {
  await customerController.getAll(context.request, context.response);
});

CustomerRouter.get("/customers/:id", async (context) => {
  await customerController.getById(context.request, context.response);
});

CustomerRouter.put("/customers/:id", async (context) => {
  await customerController.update(context.request, context.response);
});

CustomerRouter.delete("/customers/:id", async (context) => {
  await customerController.delete(context.request, context.response);
});

export { CustomerRouter };
