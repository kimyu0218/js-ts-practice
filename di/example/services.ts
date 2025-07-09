import { Bean } from "../src/decorators";

export interface BaseService {
    hi: () => void;
}

@Bean({ type: 'Service' })
export class ServiceA {
  hi() {
    console.log('ServiceA');
  }
}

@Bean()
export class ServiceB {
  hi() {
    console.log('ServiceB');
  }
}