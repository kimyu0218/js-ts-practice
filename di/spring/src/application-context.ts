import { Constructor } from './types';

export class ApplicationContext {
  private static _instance: ApplicationContext;
  private readonly _container = new Map<string, Map<string, any>>();

  private constructor(private _profile: string) {}

  static getInstance(profile: string = 'dev'): ApplicationContext {
    const instance = ApplicationContext._instance;
    if (!instance) {
      ApplicationContext._instance = new ApplicationContext(profile);
      ApplicationContext._instance.log('Initialized ApplicationContext.');
    }
    return ApplicationContext._instance;
  }

  registerBean(key: string, profile: string, clazz: Constructor) {
    if (!this._container.has(profile)) {
      this._container.set(profile, new Map());
    }

    const profileContainer = this._container.get(profile) as Map<string, any>;
    if (profileContainer.has(key)) {
      throw new Error(`No qualifying bean of "${key}" available: expected single matching but found N.`);
    }
    profileContainer.set(key, new clazz());
    this.log(`Registered bean "${profile}.${key}".`);
  }

  getBean<T = any>(key: string): T {
    const instance = this._container.get(this._profile)?.get(key);
    if (!instance) {
      throw new Error(
        `No qualifying bean of "${key}" available: expected at least 1 bean which qualifies as autowire.`
      );
    }
    return instance;
  }

  getBeans(): [string, any][] {
    const beans: [string, any][] = [];

    const profileContainer = this._container.get(this._profile) as Map<string, any>;
    for (const [key, bean] of profileContainer) {
      beans.push([key, bean]);
    }
    return beans;
  }

  private log(message: string) {
    console.log(`[${ApplicationContext.name}] [${this._profile.padEnd(12)}] ${message}`);
  }
}
