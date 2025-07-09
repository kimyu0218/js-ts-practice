import { Autowired } from "../src/decorators";
import { BaseService } from "./services";

export class Controller {
  @Autowired()
  private service?: BaseService;

  constructor() {
    console.log('Controller');
    this.service?.hi();
  }
}