import { Bean, Profile } from "../../../src/decorators";

export abstract class BaseAnimalService {
  hi() {}
}

export interface BaseCatInterface {
  hi(): void;
}

@Bean()
export class CatService extends BaseAnimalService {
  hi() {
    console.log('Cat');
  }
}

@Bean()
@Profile('test')
export class DogService extends BaseAnimalService {
  hi() {
    console.log('Dog');
  }
}

@Bean()
export class BirdService implements BaseCatInterface {
  hi(): void {
    console.log('Bird');
  }
}
