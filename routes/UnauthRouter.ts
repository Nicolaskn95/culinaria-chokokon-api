import { Router } from "https://deno.land/x/oak/mod.ts";
import { CustomerRouter } from "../features/Customer/CustomerRouter.ts";

const UnauthRouter = new Router();

// UnauthRouter.get("/unauth/login", (context) => {
//   context.response.status = 200;
//   context.response.body = {
//     message: "Hello Wor",
//   };
// });

UnauthRouter.use(CustomerRouter.routes());

export { UnauthRouter };
