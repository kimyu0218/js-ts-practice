export type Constructor = new (...args: any[]) => any;
export type Profile = string;

export type Injectable = Constructor | string;

export interface Inject {
  injectable: Injectable;
  propertyKey: string | symbol;
}

export type Provider = ClassProvider | ValueProvider;

export interface ClassProvider {
  provide: Injectable;
  useClass: Constructor;
}

export interface ValueProvider {
  provide: Injectable;
  useValue: any;
}
