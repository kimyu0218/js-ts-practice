import { Container } from '../container';
import { Injectable } from '../types';

interface InjectOptions {
  injectable: Injectable;
  lazy?: boolean;
}

function resolveInjectOptions(options: Injectable | InjectOptions): Required<InjectOptions> {
  if (typeof options === 'object' && 'injectable' in options) {
    return {
      injectable: options.injectable,
      lazy: options.lazy ?? false,
    };
  }
  return {
    injectable: options,
    lazy: false,
  };
}

export function Inject(options: Injectable | InjectOptions): PropertyDecorator {
  return (target: any, propertyKey: symbol | string) => {
    const container = Container.getInstance();
    const { injectable, lazy } = resolveInjectOptions(options);

    container.addInject(target, { injectable, propertyKey });
    if (!lazy) {
      target[propertyKey] = container.get(injectable); // 현재 프로파일에 등록된 컴포넌트 반환
    }
  };
}
