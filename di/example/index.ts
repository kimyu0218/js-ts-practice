import { Inject } from '../src/decorators/inject';
import { CatController } from './cat/controller';

class App {
  @Inject(CatController)
  private controller?: CatController;

  meow() {
    this.controller?.meow();
  }
}

const app = new App();
app.meow();
