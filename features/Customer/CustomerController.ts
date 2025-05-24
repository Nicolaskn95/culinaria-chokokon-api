import { throwlhos } from "../../globals/Throwlhos.ts";
import { Customer } from "../../models/Customer.ts";
import { CustomerService } from "./CustomerService.ts";
import { Response, Request, Status } from "https://deno.land/x/oak/mod.ts";
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
      const customer = new Customer(data);
      const createdCustomer = await this.customerService.createCustomer(
        customer
      );

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

      res.status = Status.OK;
      res.body = customers.map((customer) => customer.toJSON());
    } catch (error) {
      throw error;
    }
  }

  getById(req: Request, res: Response) {
    try {
      const id = req.url.searchParams.get("id");
      if (!id) {
        throw throwlhos.err_badRequest("ID do cliente não fornecido");
      }
      const customer = this.customerService.getCustomerById(id);
      res.status = Status.OK;
      res.body = customer;
    } catch (error) {
      throw error;
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.url.searchParams.get("id");
      if (!id) {
        throw throwlhos.err_badRequest("ID do cliente não fornecido");
      }

      const data = (await req.body.json()) as Partial<ICustomer>;
      if (!data) {
        throw throwlhos.err_badRequest("Dados do cliente não fornecidos");
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

      const updatedCustomer = await this.customerService.updateCustomer(
        id,
        data
      );
      if (!updatedCustomer) {
        throw throwlhos.err_notFound("Cliente não encontrado");
      }

      res.status = Status.OK;
      res.body = updatedCustomer;
    } catch (error) {
      throw error;
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.url.searchParams.get("id");
      if (!id) {
        throw throwlhos.err_badRequest("ID do cliente não fornecido");
      }
      const deletedCustomer = await this.customerService.deleteCustomer(id);
      if (!deletedCustomer) {
        throw throwlhos.err_notFound("Cliente não encontrado");
      }
      res.status = Status.OK;
      res.body = deletedCustomer;
    } catch (error) {
      throw error;
    }
  }
}

export { CustomerController };
