import { Router } from "../deps.ts";
import {
  criarProduto,
  calcularPrecoProduto,
} from "../controllers/produtoController.ts";

const router = new Router();

router.post("/produtos", async (ctx) => {
  try {
    const body = await ctx.request.body.json();
    const produto = await criarProduto(
      body.nome,
      body.componentes,
      body.margemLucro
    );
    ctx.response.body = produto;
    ctx.response.status = 201;
  } catch (error) {
    ctx.response.body = { error: error };
    ctx.response.status = 400;
  }
});

router.get("/produtos/:id/preco", async (ctx) => {
  try {
    const precoInfo = await calcularPrecoProduto(ctx.params.id);
    ctx.response.body = precoInfo;
  } catch (error) {
    ctx.response.body = { error: error };
    ctx.response.status = 404;
  }
});

export default router;
