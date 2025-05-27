import { throwlhos } from "../../globals/Throwlhos.ts";
import { Customer } from "../../models/Customer.ts";
import { CustomerService } from "./CustomerService.ts";
import {
  Response,
  Request,
  Status,
} from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { ICustomer } from "../../interfaces/customer/ICustomer.ts";

class CustomerController {
  private customerService: CustomerService;

  constructor({ customerService = new CustomerService() } = {}) {
    this.customerService = customerService;
  }

  async create(req: Request, res: Response) {
    try {
      const data = (await req.body.json()) as ICustomer;
      if (!data) {
        throw throwlhos.err_badRequest("Dados do cliente não fornecidos");
      }

      // Validate required fields
      if (!data.name || !data.reference) {
        throw throwlhos.err_badRequest("Nome e referência são obrigatórios");
      }

      // Validate address if provided
      if (data.address) {
        const { street, number, city, state, cep } = data.address;
        if (!street || !number || !city || !state || !cep) {
          throw throwlhos.err_badRequest(
            "Todos os campos do endereço são obrigatórios exceto complemento"
          );
        }
      }

      const createdCustomer = await this.customerService.createCustomer(data);

      if (!createdCustomer) {
        throw throwlhos.err_notFound("Cliente não encontrado");
      }

      res.status = Status.Created;
      res.body = createdCustomer;
    } catch (error) {
      throw error;
    }
  }

  getAll(_req: Request, res: Response) {
    try {
      const customers = () => this.customerService.getCustomers();
      if (!customers) {
        throw throwlhos.err_notFound("Nenhum cliente encontrado");
      }
      res.status = Status.OK;
      res.body = customers;
    } catch (error) {
      throw error;
    }
  }

  getById(req: Request, res: Response) {
    try {
      const id = req.url.pathname.split("/").pop();

      if (!id) {
        throw throwlhos.err_badRequest("ID do cliente não fornecido");
      }
      const customer = () => this.customerService.getCustomerById(id);
      if (!customer) {
        throw throwlhos.err_notFound("Cliente não encontrado");
      }
      res.status = Status.OK;
      res.body = customer;
    } catch (error) {
      throw error;
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.url.pathname.split("/").pop();

      if (!id) {
        res.status = Status.BadRequest;
        res.body = { error: "ID não fornecido" };
        return;
      }

      if (!req.hasBody) {
        res.status = Status.BadRequest;
        res.body = { error: "Dados não fornecidos" };
        return;
      }

      const data = (await req.body.json()) as ICustomer;

      if (!data || Object.keys(data).length === 0) {
        res.status = Status.BadRequest;
        res.body = { error: "Dados inválidos" };
        return;
      }

      const customer = new Customer(data);
      const updatedCustomer = await this.customerService.updateCustomer(
        id,
        customer
      );

      if (!updatedCustomer) {
        res.status = Status.NotFound;
        res.body = { error: "Cliente não encontrado" };
        return;
      }

      res.status = Status.OK;
      res.body = updatedCustomer;
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);

      if (res.writable) {
        res.status = Status.InternalServerError;
        res.body = {
          error: "Erro interno",
          details: error,
        };
      }
    }
  }

  delete(req: Request, res: Response) {
    try {
      const id = req.url.pathname.split("/").pop();
      if (!id) {
        res.status = Status.BadRequest;
        res.body = { error: "ID do cliente não fornecido" };
        return;
      }

      const deletedCustomer = () => this.customerService.deleteCustomer(id);
      if (!deletedCustomer) {
        res.status = Status.NotFound;
        res.body = { error: "Cliente não encontrado" };
        return;
      }

      res.status = Status.OK;
      res.body = deletedCustomer;
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);

      if (res.writable) {
        res.status = Status.InternalServerError;
        res.body = {
          error: "Erro interno",
          details: error,
        };
      }
    }
  }
}

export { CustomerController };
