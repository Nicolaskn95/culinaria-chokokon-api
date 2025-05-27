import { Router } from "https://deno.land/x/oak/mod.ts";
import { CustomerController } from "./CustomerController.ts";

const CustomerRouter = new Router();
const customerController = new CustomerController();

CustomerRouter.post("/customers", async (context) => {
  await customerController.create(context.request, context.response);
});

CustomerRouter.get("/customers", (context) => {
  customerController.getAll(context.request, context.response);
});

CustomerRouter.get("/customers/:id", (context) => {
  customerController.getById(context.request, context.response);
});

CustomerRouter.put("/customers/:id", async (context) => {
  await customerController.update(context.request, context.response);
});

CustomerRouter.delete("/customers/:id", async (context) => {
  await customerController.delete(context.request, context.response);
});

export { CustomerRouter };
