import { Autowired, Bean } from "../../../src/decorators";
import { BaseAnimalService } from "./services";

@Bean()
export class AnimalController {
  @Autowired(BaseAnimalService)
  service?: BaseAnimalService;

  constructor() {}
}
