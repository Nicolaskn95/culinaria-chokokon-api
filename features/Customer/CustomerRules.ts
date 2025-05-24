import { BaseRules } from "../../interfaces/base/BaseRules.ts";

class CustomerRules extends BaseRules {
  constructor() {
    super();
    // this.rules = {
    //   name: { required: true, type: "string" },
    //   reference: { required: true, type: "string" },
    //   phone: { required: false, type: "string" },
    //   address: {
    //     required: false,
    //     type: "object",
    //     properties: {
    //       street: { required: true, type: "string" },
    //       number: { required: true, type: "string" },
    //       complement: { required: false, type: "string" },
    //       city: { required: true, type: "string" },
    //       state: { required: true, type: "string" },
    //       cep: { required: true, type: "string" },
    //     },
    //   },
    //   userId: { required: false, type: "string" },
    // };
  }
}

export { CustomerRules };
