import { Customer } from "../../models/Customer.ts";
import { CustomerRepository } from "../../repositories/CustomerRepository.ts";
import { ICustomer } from "../../interfaces/customer/ICustomer.ts";

class CustomerService {
  private customerRepository: CustomerRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  async createCustomer(customer: Customer) {
    return await this.customerRepository.create(customer);
  }

  async getCustomers() {
    const customers = await this.customerRepository.findMany({});
    return customers;
  }

  async getCustomerById(id: string) {
    return await this.customerRepository.findById(id);
  }

  async updateCustomer(id: string, customerData: Partial<ICustomer>) {
    return await this.customerRepository.findByIdAndUpdate(id, customerData);
  }

  async deleteCustomer(id: string) {
    return await this.customerRepository.deleteById(id).exec();
  }
}

export { CustomerService };
