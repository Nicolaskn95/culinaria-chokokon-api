import { throwlhos } from "../../globals/Throwlhos.ts";
import { Customer } from "../../models/Customer.ts";
import { CustomerService } from "./CustomerService.ts";
import {
  Response,
  Request,
  Status,
} from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { ICustomer } from "../../interfaces/customer/ICustomer.ts";
import { CustomerRules } from "./CustomerRules.ts";

class CustomerController {
  private customerService: CustomerService;
  private customerRules: CustomerRules;

  constructor() {
    this.customerService = new CustomerService();
    this.customerRules = new CustomerRules();
  }

  async create(req: Request, res: Response) {
    try {
      const data = (await req.body.json()) as ICustomer;

      const validation = this.customerRules.validateCreate(data);
      if (!validation.isValid) {
        res.status = Status.BadRequest;
        res.body = { errors: validation.errors };
        return;
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

  async getAll(_req: Request, res: Response) {
    try {
      const customers = await this.customerService.getCustomers();
      if (customers.length === 0) {
        res.status = Status.NotFound;
        res.body = { error: "Nenhum cliente encontrado" };
        return;
      }
      res.status = Status.OK;
      res.body = customers;
    } catch (error) {
      throw error;
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = req.url.pathname.split("/").pop();
      if (!id) {
        res.status = Status.BadRequest;
        res.body = { error: "ID do cliente não fornecido" };
        return;
      }

      const validation = this.customerRules.validateId(id);
      if (!validation.isValid) {
        res.status = Status.BadRequest;
        res.body = { errors: validation.errors };
        return;
      }

      const customer = await this.customerService.getCustomerById(id);
      if (!customer) {
        res.status = Status.NotFound;
        res.body = { error: "Cliente não encontrado" };
        return;
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
        res.body = { error: "ID do cliente não fornecido" };
        return;
      }

      const data = (await req.body.json()) as Partial<ICustomer>;
      if (!data || Object.keys(data).length === 0) {
        res.status = Status.BadRequest;
        res.body = { error: "Dados inválidos" };
        return;
      }

      const validation = this.customerRules.validateUpdate(id, data);
      if (!validation.isValid) {
        res.status = Status.BadRequest;
        res.body = { errors: validation.errors };
        return;
      }

      const customer = new Customer(data as ICustomer);
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
      throw error;
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.url.pathname.split("/").pop();
      if (!id) {
        res.status = Status.BadRequest;
        res.body = { error: "ID do cliente não fornecido" };
        return;
      }

      const validation = this.customerRules.validateId(id);
      if (!validation.isValid) {
        res.status = Status.BadRequest;
        res.body = { errors: validation.errors };
        return;
      }

      const customer = await this.customerService.getCustomerById(id);
      const deletedCustomer = await this.customerService.deleteCustomer(id);
      if (!deletedCustomer) {
        res.status = Status.NotFound;
        res.body = { error: "Cliente não encontrado" };
        return;
      }

      res.status = Status.OK;
      res.body = {
        message: `Cliente ${customer?.name} deletado com sucesso`,
      };
    } catch (error) {
      res.status = Status.InternalServerError;
      res.body = {
        error: "Erro ao deletar cliente",
        details: error instanceof Error ? error.message : error,
      };
    }
  }
}

export { CustomerController };
