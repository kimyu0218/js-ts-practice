import { Bean } from "../src/decorators";

export interface BaseService {
    hi: () => void;
}

@Bean({ type: 'BaseService' })
export class ServiceA {
    hi() {
        console.log("ServiceA");
    }
}

@Bean({ type: 'BaseService2' })
export class ServiceB {
    hi() {
        console.log("ServiceB");
    }
}