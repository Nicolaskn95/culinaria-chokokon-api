import mongoose from "npm:mongoose@^6.7";
import { SubReceita } from "./SubReceita.ts";

interface IProdutoComponente {
  subReceita: mongoose.Types.ObjectId;
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
  componentes: [{
    subReceita: { type: mongoose.Schema.Types.ObjectId, ref: "SubReceita" },
    quantidade: { type: Number, required: true }
  }],
  margemLucro: { type: Number, default: 0.3 } // 30% de margem
});

// Calcular preço sugerido
ProdutoSchema.pre<IProduto>("save", async function() {
  let custoTotal = 0;
  
  for (const comp of this.componentes) {
    const subReceita = await SubReceita.findById(comp.subReceita).exec();
    if (subReceita && subReceita.custoTotal) {
      custoTotal += subReceita.custoTotal * comp.quantidade;
    }
  }
  
  this.precoSugerido = custoTotal * (1 + this.margemLucro);
});

export const Produto = mongoose.model<IProduto>("Produto", ProdutoSchema);