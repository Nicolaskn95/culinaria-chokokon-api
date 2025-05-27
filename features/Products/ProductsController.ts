import { Response, Request } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { ProductsService } from "./ProductsService.ts";
import { ProductsRules } from "./ProductsRules.ts";
import { Status } from "jsr:@oak/commons@1/status";
import { throwlhos } from "../../globals/Throwlhos.ts";

export class ProductsController {
  private service: ProductsService;
  private rules: ProductsRules;

  constructor() {
    this.service = new ProductsService();
    this.rules = new ProductsRules();
  }

  async create(req: Request, res: Response) {
    try {
      const body = await req.body.json();
      const validation = this.rules.validateCreate(body);

      if (!validation.isValid) {
        res.status = 400;
        res.body = { errors: validation.errors };
        return;
      }

      const product = await this.service.create(body);
      if (!product) {
        res.status = 400;
        res.body = { error: "Falha ao criar produto" };
        return;
      }

      res.status = Status.Created;
      res.body = product;
    } catch (error) {
      throw throwlhos.err_internalServerError(error as string);
    }
  }

  async findAll(_req: Request, res: Response) {
    try {
      const products = await this.service.findAll();
      if (!products) {
        throw throwlhos.err_notFound("Nenhum produto encontrado");
      }
      res.status = Status.OK;
      res.body = products;
    } catch (error) {
      throw throwlhos.err_internalServerError(error as string);
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const id = req.url.pathname.split("/").pop();
      if (!id) {
        throw throwlhos.err_badRequest("ID do produto inválido");
      }

      const validation = this.rules.validateId(id);
      if (!validation.isValid) {
        throw throwlhos.err_badRequest(validation.errors as unknown as string);
      }

      const product = await this.service.findById(id);
      if (!product) {
        throw throwlhos.err_notFound("Produto não encontrado");
      }
      res.status = Status.OK;
      res.body = product;
    } catch (error) {
      throw throwlhos.err_internalServerError(error as string);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.url.pathname.split("/").pop();
      if (!id) {
        res.status = Status.BadRequest;
        res.body = { error: "ID do produto inválido" };
        return;
      }

      const body = await req.body.json();
      const validation = this.rules.validateUpdate(id, body);

      if (!validation.isValid) {
        res.status = Status.BadRequest;
        res.body = { errors: validation.errors };
        return;
      }

      const product = await this.service.update(id, body);
      if (!product) {
        res.status = Status.NotFound;
        res.body = { error: "Produto não encontrado" };
        return;
      }
      res.status = Status.OK;
      res.body = product;
    } catch (error) {
      throw throwlhos.err_internalServerError(error as string);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.url.pathname.split("/").pop();
      if (!id) {
        res.status = Status.BadRequest;
        res.body = { error: "ID do produto inválido" };
        return;
      }

      const validation = this.rules.validateId(id);
      if (!validation.isValid) {
        res.status = Status.BadRequest;
        res.body = { errors: validation.errors };
        return;
      }
      const product = await this.service.findById(id);

      const deletedProduct = await this.service.delete(id);
      if (!deletedProduct) {
        res.status = Status.NotFound;
        res.body = { error: "Produto não encontrado" };
        return;
      }
      res.status = Status.OK;
      res.body = {
        message: `Produto ${product?.name} deletado com sucesso`,
      };
    } catch (error) {
      throw throwlhos.err_internalServerError(error as string);
    }
  }
}
