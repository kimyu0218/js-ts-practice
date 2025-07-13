import { smartProxy } from '../src/smart-proxy';

const fallback = { age: 1, meow: () => console.log('Meow') };

class Zoo {
  cat: any;

  meow() {
    this.cat.meow();
  }

  bark() {
    console.log('Bark');
  }
}

const zoo = new Zoo();
const proxy = smartProxy(zoo, fallback);

proxy.meow();
proxy.bark();
