import mongoose from "npm:mongoose@^6.7";

interface ICliente extends mongoose.Document {
  nome: string;
  referencia: string;
  endereco?: string;
  telefone?: string;
  dataNascimento?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const clienteSchema = new mongoose.Schema<ICliente>(
  {
    nome: { type: String, required: true },
    referencia: { type: String, required: true },
    endereco: { type: String },
    telefone: { type: String },
    dataNascimento: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

clienteSchema.pre<ICliente>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Cliente = mongoose.model<ICliente>("Clientes", clienteSchema);
