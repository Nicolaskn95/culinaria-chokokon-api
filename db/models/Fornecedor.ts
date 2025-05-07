import mongoose from "npm:mongoose@^6.7";

interface IFornecedor extends mongoose.Document {
  nome: string;
  tipo: "atacado" | "varejo" | "diretamente" | "outro";
  contato: {
    telefone?: string;
    email?: string;
    endereco?: string;
    responsavel?: string;
  };
  tempoEntrega?: number; // em dias
  avaliacao?: number; // de 1 a 5
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const fornecedorSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  tipo: {
    type: String,
    required: true,
    enum: ["atacado", "varejo", "diretamente", "outro"],
    default: "outro",
  },
  contato: {
    telefone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    endereco: { type: String, trim: true },
    responsavel: { type: String, trim: true },
  },
  tempoEntrega: {
    type: Number,
    min: 0,
    default: 0,
  },
  avaliacao: {
    type: Number,
    min: 1,
    max: 5,
  },
  observacoes: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Atualiza o campo updatedAt antes de salvar
fornecedorSchema.pre<IFornecedor>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Cria o modelo se não existir
export const Fornecedor = mongoose.model<IFornecedor>(
  "Fornecedores",
  fornecedorSchema
);
