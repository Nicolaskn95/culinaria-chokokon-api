import mongoose from "npm:mongoose@^6.7";
import { Ingrediente } from "./Ingredientes.ts";

interface ISubReceitaItem {
  ingrediente: mongoose.Types.ObjectId;
  quantidade: number;
}

interface ISubReceita extends mongoose.Document {
  nome: string;
  itens: ISubReceitaItem[];
  custoTotal?: number;
}

const SubReceitaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  itens: [{
    ingrediente: { type: mongoose.Schema.Types.ObjectId, ref: "Ingrediente" },
    quantidade: { type: Number, required: true }
  }]
});

// Middleware para calcular custo total antes de salvar
SubReceitaSchema.pre<ISubReceita>("save", async function() {
  let custo = 0;
  
  for (const item of this.itens) {
    const ingrediente = await Ingrediente.findById(item.ingrediente).exec();
    if (ingrediente) {
      custo += ingrediente.preco * item.quantidade;
    }
  }
  
  this.custoTotal = custo;
});

export const SubReceita = mongoose.model<ISubReceita>("SubReceita", SubReceitaSchema);