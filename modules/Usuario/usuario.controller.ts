import mongoose from "npm:mongoose@^6.7";

interface IBuscarUnicoUsuario {
  id?: string;
  email?: string;
}

class UserController {
  buscarUnicoUsuario = async ({ id, email }: IBuscarUnicoUsuario) => {
    const usuario = await mongoose.model("usuarios").findById(id);
    return usuario;
  };
}

export default UserController;
