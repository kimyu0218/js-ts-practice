import { Autowired } from "../src/decorators";
import { BaseService } from "./services";

export class Controller {

    @Autowired({ type: 'BaseService' })
    private service?: BaseService;

    constructor() {
        console.log("Controller");
        this.service?.hi();
    }
}