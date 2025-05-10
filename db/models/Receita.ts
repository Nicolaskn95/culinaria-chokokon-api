import mongoose from "npm:mongoose@^6.7";
import { Ingrediente } from "./Ingrediente.ts";

interface IReceitaItem {
  ingrediente: mongoose.Types.ObjectId;
  quantidade: number;
}

interface IReceita extends mongoose.Document {
  nome: string;
  itens: IReceitaItem[];
  custoTotal?: number;
}

const ReceitaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  itens: [
    {
      ingrediente: { type: mongoose.Schema.Types.ObjectId, ref: "Ingrediente" },
      quantidade: { type: Number, required: true },
    },
  ],
});

// Middleware para calcular custo total antes de salvar
ReceitaSchema.pre<IReceita>("save", async function () {
  let custo = 0;

  for (const item of this.itens) {
    const ingrediente = await Ingrediente.findById(item.ingrediente).exec();
    if (ingrediente) {
      custo += ingrediente.preco * item.quantidade;
    }
  }

  this.custoTotal = custo;
});

export const Receita = mongoose.model<IReceita>("Receitas", ReceitaSchema);
