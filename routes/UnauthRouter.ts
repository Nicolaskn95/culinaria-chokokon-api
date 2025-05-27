import { Router } from "https://deno.land/x/oak/mod.ts";
import { CustomerRouter } from "../features/Customer/CustomerRouter.ts";
import { ProductsRouter } from "../features/Products/ProductsRouter.ts";

const UnauthRouter = new Router();

// UnauthRouter.get("/unauth/login", (context) => {
//   context.response.status = 200;
//   context.response.body = {
//     message: "Hello Wor",
//   };
// });

UnauthRouter.use(CustomerRouter.routes());
UnauthRouter.use(ProductsRouter.routes());
export { UnauthRouter };
