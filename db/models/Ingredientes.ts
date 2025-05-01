// db/models/Ingrediente.ts (atualizado)
import mongoose from "npm:mongoose@^6.7";

interface IIngrediente extends mongoose.Document {
  nome: string;
  marca: string;
  fornecedor: mongoose.Types.ObjectId; // Agora referencia o modelo Fornecedor
  preco: number;
  unidadeMedida: string;
  localCompra: string;
  variacoes?: {
    tamanho?: string;
    embalagem?: string;
    codigo?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ingredienteSchema = new mongoose.Schema({
  nome: { type: String, required: true, index: true },
  marca: { type: String, required: true },
  fornecedor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Fornecedor',
    required: true 
  },
  preco: { type: Number, required: true, min: 0 },
  unidadeMedida: { 
    type: String, 
    required: true,
    enum: ["g", "kg", "ml", "L", "un", "cx", "dz"]
  },
  localCompra: { type: String, required: true },
  variacoes: {
    tamanho: String,
    embalagem: String,
    codigo: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Atualiza o timestamp antes de salvar
ingredienteSchema.pre<IIngrediente>('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Ingrediente = mongoose.model<IIngrediente>('Ingrediente', ingredienteSchema);