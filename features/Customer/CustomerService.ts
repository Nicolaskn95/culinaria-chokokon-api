import { Customer } from "../../models/Customer.ts";
import { CustomerRepository } from "../../repositories/CustomerRepository.ts";
import { ICustomer } from "../../interfaces/customer/ICustomer.ts";

class CustomerService {
  private customerRepository: CustomerRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  createCustomer(customer: Customer) {
    return this.customerRepository.create(customer);
  }

  async getCustomers() {
    const customers = await this.customerRepository.findMany({});
    return customers;
  }

  getCustomerById(id: string) {
    return this.customerRepository.findById(id);
  }

  updateCustomer(id: string, customerData: Partial<ICustomer>) {
    return this.customerRepository.updateOne({ _id: id }, customerData);
  }

  deleteCustomer(id: string) {
    return this.customerRepository.deleteOne({ _id: id });
  }
}

export { CustomerService };
