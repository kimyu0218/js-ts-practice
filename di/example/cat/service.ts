import { Injectable } from '../../src/decorators/injectable';

@Injectable()
export class CatService {
  constructor() {
    console.log('CatService');
  }

  meow() {
    console.log('Meow');
  }
}
