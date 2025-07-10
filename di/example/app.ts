import { Context, Module } from '../src/decorators';
import { AnimalModule } from './src/animal/module';

@Module({ beans: [AnimalModule] })
@Context()
class Application {
  run() {}
}
