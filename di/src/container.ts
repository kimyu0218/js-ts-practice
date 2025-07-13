import { ERROR_MESSAGES, LOG_MESSAGES } from './constants';
import type { ClassProvider, Profile, Provider, Inject, ValueProvider, Injectable } from './types';
import { getClassName } from './utils';

export class Container {
  private static _instance: Container;

  private readonly _providers = new Map<Profile, Map<Injectable, Provider>>();
  private readonly _injects = new Map<string, Set<Inject>>();
  private readonly _injected = new Map<Injectable, any>();

  private _profile: Profile = 'dev';
  private _setProfile: boolean = false;

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

  static setProfile(profile: Profile) {
    const instance = Container.getInstance();
    if (instance._setProfile) {
      throw new Error(ERROR_MESSAGES.PROFILE_ALREADY_SET);
    }

    instance._profile = profile;
    instance._setProfile = true;
    instance.log(`Set profile as "${profile}".`);
  }

  provide(profile: Profile, providers: Provider[]) {
    providers.forEach((provider) => {
      if (!this._providers.has(profile)) {
        this._providers.set(profile, new Map());
      }

      const token = this.getToken(provider.provide);
      const profileProviders = this._providers.get(profile);
      if (profileProviders?.has(token)) {
        throw new Error(ERROR_MESSAGES.MULTIPLE_PROVIDERS(token));
      }
      profileProviders?.set(token, provider);
      this.log(LOG_MESSAGES.REGISTER(profile, token));
    });
  }

  get<T = any>(injectable: Injectable): T {
    const token = this.getToken(injectable);
    const provider = this._providers.get(this._profile)?.get(token);
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

    this._injected.set(injectable, instance);
    this.log(LOG_MESSAGES.INJECT(this._profile, token));
    return instance;
  }

  addInject(target: any, inject: Inject) {
    const className = getClassName(target);
    if (!this._injects.has(className)) {
      this._injects.set(className, new Set());
    }
    this._injects.get(className)?.add(inject);
  }

  getInjects(target: any) {
    const className = getClassName(target);
    const properties = this._injects.get(className);
    if (!properties) {
      return [];
    }

    const injects = [];
    for (const { propertyKey, injectable } of properties) {
      const instance = this._providers.get(this._profile)?.get(injectable);
      injects.push([propertyKey, instance]);
    }
    return injects;
  }

  private getToken(injectable: Injectable): string {
    if (typeof injectable === 'string') {
      return injectable;
    }
    return getClassName(injectable);
  }

  private resolveInjections(instance: any, injects: Set<Inject>) {
    console.warn('resolve');
    console.warn(instance);
    for (const { injectable, propertyKey } of injects) {
      if (this._injected.has(injectable)) {
        instance[propertyKey] = this._injected.get(injectable);
      } else {
        instance[propertyKey] = this.get(injectable);
      }
    }
  }

  // for logging
  private log(message: string) {
    console.info(`[${Container.name}] [${this._profile.padEnd(12)}] ${message}`);
  }

  // for test
  static reset() {
    const container = Container.getInstance();
    container._providers.clear();
    container._injects.clear();
    container._injected.clear();
    container._profile = 'dev';
    container._setProfile = false;
  }
}
