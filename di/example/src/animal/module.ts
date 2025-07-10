import { Module } from '../../../src/decorators';
import { AnimalController } from './controllers';
import { BirdService, CatService, DogService } from './services';

@Module({
    beans: [AnimalController, CatService, DogService, BirdService]
})
export class AnimalModule {}