import { Produto } from "../db/models/Produto.ts";

export const criarProduto = async (
  nome: string,
  componentes: Array<{
    subReceitaId: string;
    quantidade: number;
  }>,
  margemLucro?: number
) => {
  try {
    const novoProduto = new Produto({
      nome,
      componentes: componentes.map((comp) => ({
        subReceita: comp.subReceitaId,
        quantidade: comp.quantidade,
      })),
      margemLucro: margemLucro || 0.3,
    });

    await novoProduto.save();
    return novoProduto;
  } catch (error) {
    throw error;
  }
};

export const calcularPrecoProduto = async (produtoId: string) => {
  const produto = await Produto.findById(produtoId).populate({
    path: "componentes.subReceita",
    populate: { path: "itens.ingrediente" },
  });

  if (!produto) throw new Error("Produto não encontrado");

  return {
    nome: produto.nome,
    custoTotal: produto.componentes.reduce((acc, comp) => {
      return acc + comp.receita.custoTotal * comp.quantidade;
    }, 0),
    precoSugerido: produto.precoSugerido,
    margemLucro: produto.margemLucro,
  };
};
