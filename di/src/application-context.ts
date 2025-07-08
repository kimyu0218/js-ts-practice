import { BeanClass, Profile } from "./types";

type Constructor<T = any> = new (...args: any[]) => T;

export class ApplicationContext {
    private static _instance: ApplicationContext;

    private readonly _container = new Map<string, any>();
    private readonly _beanMap = new Map<Profile, Map<BeanClass, Constructor>>();

    private constructor(private _profile: string) {}

    static getInstance(profile: Profile = 'dev'): ApplicationContext {
        const instance = ApplicationContext._instance;
        if(instance && profile !== instance._profile) {
            throw new Error(`[${ApplicationContext.name}] ApplicationContext for profile "${instance._profile}" is already initialized.`);
        }

        if (!instance) {
            ApplicationContext._instance = new ApplicationContext(profile);
            console.log(`[${ApplicationContext.name}] Initialized with profile "${profile}".`)
        }
        return ApplicationContext._instance;
    }

    registerBean(key: string, profile: Profile, clazz: Constructor) {
        if (!this._beanMap.has(profile)) {
            this._beanMap.set(profile, new Map());
        }

        const profileMap = this._beanMap.get(profile)!;
        profileMap.set(key, clazz);

        if (profile === this._profile) {
            if(this._container.get(key)) {
                throw new Error(`[${ApplicationContext.name}] No qualifying bean of "${key}" available: expected single matching but found N.`);
            }
            this._container.set(key, new clazz());
            console.log(`[${ApplicationContext.name}] Registered bean "${key}".`)
        }
    }

    getBean<T = any>(key: BeanClass): T {
        const instance = this._container.get(key);
        if (!instance) {
            throw new Error(`[${ApplicationContext.name}] No qualifying bean of "${key}" available: expected at least 1 bean which qualifies as autowire.`);
        }
        return instance;
    }
}