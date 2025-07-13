import { Inject } from '../../src/decorators/inject';
import { Injectable } from '../../src/decorators/injectable';
import { CatService } from './service';

@Injectable()
export class CatController {
  @Inject(CatService)
  private service: CatService | null = null;

  constructor() {
    console.log('CatController');
  }

  meow() {
    this.service?.meow();
  }
}
