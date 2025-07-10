import { BeanParameter, ModuleParameter } from './types';
import { ApplicationContext } from './application-context';

const PROP_KEY = {
  PROFLIE: 'profile',
  BEANS: 'beans',
};

export function Bean({ name, value }: BeanParameter = {}): ClassDecorator {
  return (target: any) => {
    const profile = Object.getOwnPropertyDescriptor(target, PROP_KEY.PROFLIE)?.value ?? 'dev';
    const context = ApplicationContext.getInstance();

    if (name) {
      context.registerBean(name, profile, target);
    } else if (value) {
      context.registerBean(value, profile, target);
    } else {
      const proto = Object.getPrototypeOf(target);
      const key = makeBeanKey(proto.name !== '' ? proto.name : target.name);
      context.registerBean(key, profile, target);
    }
  };
}

export function Profile(profile: string): ClassDecorator {
  return (target: any) => {
    Object.defineProperty(target, PROP_KEY.PROFLIE, { value: profile });
  };
}

export function Autowired(clazz: any): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    const context = ApplicationContext.getInstance();
    const key = makeBeanKey(typeof clazz == 'string' ? clazz : clazz.name);
    Object.defineProperty(target, propertyKey, { value: context.getBean(key) });
  };
}

export function Context(): ClassDecorator {
  return (target: any) => {
    ApplicationContext.getInstance();
    return new target();
  };
}

export function TestContext(): ClassDecorator {
  return (target: any) => {
    ApplicationContext.getInstance('test');
    return new target();
  };
}

export function Module({ beans = [] }: ModuleParameter): ClassDecorator {
  return (target: any) => {
    Object.defineProperty(target, PROP_KEY.BEANS, beans);

    if (typeof target.proto.run === 'function') {
      const map = new Map<string, any>();
      for (const bean of beans) {
        if (!map.has(bean.name)) {
          map.set(bean.name, new bean());
        }
      }
    }
  };
}

function makeBeanKey(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}
