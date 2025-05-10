import mongoose from "npm:mongoose@^6.7";

interface IItemPedido extends mongoose.Document {
  produto: mongoose.Types.ObjectId; // Referência ao modelo Produto
  quantidade: number;
}

interface IPedido extends mongoose.Document {
  descricao: string;
  quantidade: number; // Quantidade total de itens no pedido
  cliente: mongoose.Types.ObjectId; // Referência ao modelo Cliente
  valorTotal: number; // Valor total do pedido
  tipo: "atacado" | "varejo" | "diretamente" | "outro";
  itemsPedido: IItemPedido[];
  status_pagamento: "pago" | "pendente" | "cancelado";
  status_preparo: "preparado" | "pendente" | "cancelado";
  createdAt: Date;
  updatedAt: Date;
}

const pedidoSchema = new mongoose.Schema({});

// Atualiza o campo updatedAt antes de salvar
pedidoSchema.pre<IPedido>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Cria o modelo se não existir
export const Fornecedor = mongoose.model<IPedido>("Pedidos", pedidoSchema);
