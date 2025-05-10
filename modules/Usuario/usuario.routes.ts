import { Router } from "https://deno.land/x/oak@v17.1.4/mod.ts";

const router = new Router();

router.get("/usuario", async (ctx) => {
  ctx.response.body = "Hello World";
});

export default router;
