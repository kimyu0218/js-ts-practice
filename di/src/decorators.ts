import 'reflect-metadata';
import { ApplicationContext } from './application-context';
import { BeanClass, Profile } from './types';

type BeanFunctionParam = { 
    type?: BeanClass, 
    profile?: Profile,
    name?: string
};

type AutowiredFunctionParam = {
    type?: BeanClass, 
    name?: string
}

export function Bean({ type, profile = 'dev', name}: BeanFunctionParam): ClassDecorator {
    return (target: any) => {
        const context = ApplicationContext.getInstance(profile);
        if(name) {
            context.registerBean(name, profile, target);
        }
        else if(type) {
            context.registerBean(type, profile, target);
        }
        else {
            context.registerBean(target.name, profile, target);
        }
    };
}

export function Autowired({ type, name }: AutowiredFunctionParam): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        const key = name ?? type ?? Reflect.getMetadata('design:type', target, propertyKey);
        Object.defineProperty(target, propertyKey, {
            get() {
                const context = ApplicationContext.getInstance();
                return context.getBean(key);
            },
        });
    };
}

export function AutowiredParam({ type, name }: AutowiredFunctionParam): ParameterDecorator {
    return (target: any, propertyKey: string | symbol | undefined, _: number) => {
        const key = name ?? type ?? Reflect.getMetadata('design:type', target, propertyKey ?? '');
        Object.defineProperty(target, propertyKey ?? '', {
            get() {
                const context = ApplicationContext.getInstance();
                return context.getBean(key);
            },
        });
    };
}