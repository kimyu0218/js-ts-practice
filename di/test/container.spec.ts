import { ERROR_MESSAGES } from '../src/constants';
import { Container } from '../src/container';
import { Inject } from '../src/decorators/inject';
import { Injectable } from '../src/decorators/injectable';

describe('Container', () => {
  class A {}
  class B {}

  afterEach(() => Container.reset());

  it('컨테이너는 싱글톤이다.', () => {
    const instance1 = Container.getInstance();
    const instance2 = Container.getInstance();

    expect(instance2).toBe(instance1);
  });

  it('프로파일은 두 번 이상 설정하면 예외가 발생한다.', () => {
    Container.setProfile('profile');

    expect(() => Container.setProfile('profile')).toThrow(ERROR_MESSAGES.PROFILE_ALREADY_SET);
  });

  it('프로바이더를 등록하고 주입받을 수 있다.', () => {
    const b = new B();
    const container = Container.getInstance();
    container.provide('dev', [
      {
        provide: A,
        useClass: A,
      },
      {
        provide: B,
        useValue: b,
      },
    ]);

    expect(container.get(A)).toBeInstanceOf(A);
    expect(container.get(B)).toEqual(b);
  });

  it('중복된 토큰으로 프로바이더를 등록하면 예외가 발생한다.', () => {
    const container = Container.getInstance();
    const provide = () =>
      container.provide('dev', [
        {
          provide: 'token',
          useClass: A,
        },
      ]);
    provide();

    expect(() => provide()).toThrow(ERROR_MESSAGES.MULTIPLE_PROVIDERS('token'));
  });

  it('등록되지 않은 토큰으로 프로바이더를 조회하면 예외가 발생한다.', () => {
    const container = Container.getInstance();

    expect(() => container.get('token')).toThrow(ERROR_MESSAGES.NO_PROVIDER('token'));
  });

  it('@Inject 데코레이터가 붙은 프로퍼티를 조회할 수 있다.', () => {
    @Injectable()
    class ServiceA {}

    @Injectable()
    class ServiceB {}

    @Injectable()
    class Controller {
      @Inject(ServiceA)
      private serviceA: ServiceA | null = null;

      @Inject(ServiceB)
      private serviceB: ServiceB | null = null;
    }

    const container = Container.getInstance();
    // const controller = new Controller();

    expect(container.getInjectProperties(Controller)).toEqual([
      { propertyKey: 'serviceA', instance: container.get(ServiceA) },
      { propertyKey: 'serviceB', instance: container.get(ServiceB) },
    ]);
  });
});
