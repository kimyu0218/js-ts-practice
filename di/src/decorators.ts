import 'reflect-metadata';
import { ApplicationContext } from './application-context';

type BeanFunctionParam = {
  type?: string;
  profile?: string;
  name?: string;
  args?: any[];
};

type AutowiredFunctionParam = {
  type?: string;
  name?: string;
};

// 애플리케이션의 컨텍스트에 빈(컨텍스트 관리 대상)을 등록한다. 프로파일을 전달하지 않는 경우 dev로 판단한다.
export function Bean({ type, profile = 'dev', name, args }: BeanFunctionParam = { profile: 'dev' }): ClassDecorator {
  return (target: any) => {
    const context = ApplicationContext.getInstance();
    if (name) {
      context.registerBean(name, profile, target, args);
    } else if (type) {
      context.registerBean(type, profile, target, args);
    } else {
      context.registerBean(makeBeanKey(target.name), profile, target, args);
    }
  };
}

export function Autowired({ type, name }: AutowiredFunctionParam = {}): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    const key = name ?? type ?? makeBeanKey(propertyKey.toString());
    Object.defineProperty(target, propertyKey, {
      get() {
        const context = ApplicationContext.getInstance();
        return context.getBean(key);
      },
    });
  };
}

function makeBeanKey(str: string): string {
  str = str.endsWith('Impl') ? str.slice(0, -4) : str;
  str = str.endsWith('Mock') ? str.slice(0, -4) : str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
