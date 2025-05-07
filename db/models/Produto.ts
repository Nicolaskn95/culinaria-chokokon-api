import mongoose from "npm:mongoose@^6.7";
import { Receita } from "./Receita.ts";

interface IProdutoComponente {
  receita: mongoose.Types.ObjectId;
  quantidade: number;
}

interface IProduto extends mongoose.Document {
  nome: string;
  componentes: IProdutoComponente[];
  margemLucro: number;
  precoSugerido?: number;
}

const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  componentes: [
    {
      receita: { type: mongoose.Schema.Types.ObjectId, ref: "Receita" },
      quantidade: { type: Number, required: true },
    },
  ],
  margemLucro: { type: Number, default: 0.3 }, // 30% de margem
});

// Calcular preço sugerido
ProdutoSchema.pre<IProduto>("save", async function () {
  let custoTotal = 0;

  for (const comp of this.componentes) {
    const receita = await Receita.findById(comp.receita).exec();
    if (receita && receita.custoTotal) {
      custoTotal += receita.custoTotal * comp.quantidade;
    }
  }

  this.precoSugerido = custoTotal * (1 + this.margemLucro);
});

export const Produto = mongoose.model<IProduto>("Produtos", ProdutoSchema);
