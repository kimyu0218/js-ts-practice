export type BeanKey = string | symbol;
export type Profile = string;
export type Constructor<T = any> = new (...args: any[]) => T;

export interface BeanParameter {
  name?: string;
  value?: string;
}

export interface Autowired {}
