import mongoose from "npm:mongoose@^6.7";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

interface IUsuario extends mongoose.Document {
  nome: string;
  email: string;
  senha: string;
  tipoUsuario: "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

const usuarioSchema = new mongoose.Schema<IUsuario>(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    tipoUsuario: { type: String, enum: ["admin"], default: "admin" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// models/Usuario.ts
usuarioSchema.pre<IUsuario>("save", async function (next) {
  if (!this.isModified("senha")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    this.updatedAt = new Date();
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const Usuario = mongoose.model<IUsuario>("Usuarios", usuarioSchema);
