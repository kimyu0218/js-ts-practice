import { ERROR_MESSAGES, LOG_MESSAGES } from './constants';
import type { ClassProvider, Provider, Inject, ValueProvider, Injectable, InjectProperty } from './types';

export class Container {
  private static _instance: Container;

  private readonly _providers = new Map<string, Map<Injectable, Provider>>();
  private readonly _injects = new Map<string, Set<Inject>>();
  private readonly _injected = new Map<string, any>();

  private _env: string = 'dev';
  private _setEnv: boolean = false;

  private constructor() {}

  // for singleton
  static getInstance(): Container {
    const instance = Container._instance;
    if (!instance) {
      Container._instance = new Container();
      Container._instance.log('Initialize Container.');
    }
    return Container._instance;
  }

  static setEnv(env: string): void {
    const instance = Container.getInstance();
    if (instance._setEnv) {
      throw new Error(ERROR_MESSAGES.ENV_ALREADY_SET);
    }

    instance._env = env;
    instance._setEnv = true;
    instance.log(`Set env as "${env}".`);
  }

  provide(env: string, providers: Provider[]): void {
    providers.forEach((provider) => {
      if (!this._providers.has(env)) {
        this._providers.set(env, new Map());
      }

      const token = this.getToken(provider.provide);
      const profileProviders = this._providers.get(env);
      if (profileProviders?.has(token)) {
        throw new Error(ERROR_MESSAGES.MULTIPLE_PROVIDERS(token));
      }
      profileProviders?.set(token, provider);
      this.log(LOG_MESSAGES.REGISTER(env, token));
    });
  }

  get<T = any>(injectable: Injectable): T {
    const token = this.getToken(injectable);
    const provider = this._providers.get(this._env)?.get(token);
    if (!provider) {
      throw new Error(ERROR_MESSAGES.NO_PROVIDER(token));
    }
    let instance: any;
    if ((provider as ClassProvider).useClass) {
      instance = new (provider as ClassProvider).useClass();
    } else {
      instance = (provider as ValueProvider).useValue;
    }

    const injects = this._injects.get(token);
    if (injects) {
      this.resolveInjections(instance, injects);
    }

    this._injected.set(token, instance);
    this.log(LOG_MESSAGES.INJECT(this._env, token));
    return instance;
  }

  addInjectProperty(target: unknown, inject: Inject): void {
    const className = this.getClassName(target);
    if (!this._injects.has(className)) {
      this._injects.set(className, new Set());
    }
    this._injects.get(className)?.add(inject);
  }

  getInjectProperties(target: unknown): InjectProperty[] {
    const className = this.getClassName(target);
    const properties = this._injects.get(className);
    if (!properties) {
      return [];
    }

    const injects = [];
    for (const { propertyKey, injectable } of properties) {
      const token = this.getToken(injectable);
      const instance = this._injected.get(token);
      injects.push({ propertyKey, instance });
    }
    return injects;
  }

  private getToken(injectable: Injectable): string {
    if (typeof injectable === 'string') {
      return injectable;
    }
    return this.getClassName(injectable);
  }

  private resolveInjections(instance: any, injects: Set<Inject>): void {
    for (const { injectable, propertyKey } of injects) {
      const token = this.getToken(injectable);
      if (this._injected.has(token)) {
        instance[propertyKey] = this._injected.get(token);
      } else {
        instance[propertyKey] = this.get(injectable);
      }
    }
  }

  private getClassName(target: unknown): string {
    if (typeof target === 'function') {
      return target.name;
    }
    if (typeof target === 'object' && (target as Object).hasOwnProperty('constructor')) {
      return target?.constructor.name ?? '';
    }
    // for debugging
    console.error(typeof target);
    return '';
  }

  // for logging
  private log(message: string): void {
    console.info(`[${Container.name}] [${this._env.padEnd(12)}] ${message}`);
  }

  // for test
  static reset(): void {
    const container = Container.getInstance();
    container._providers.clear();
    container._injects.clear();
    container._injected.clear();
    container._env = 'dev';
    container._setEnv = false;
  }
}
