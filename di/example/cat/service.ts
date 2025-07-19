import { Injectable } from '../../src/decorators/injectable';

@Injectable()
export class CatService {
  meow() {
    console.log('Meow');
  }
}
