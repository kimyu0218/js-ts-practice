describe('function', () => {
  describe('함수 표현식', () => {
    it('함수 표현식에 익명 함수를 사용할 수 있다.', () => {
      const foo = () => {};

      expect(() => foo()).not.toThrow();
    });

    it('함수 표현식에 기명 함수를 사용할 수 있다.', () => {
      const foo = function foo2() {};

      expect(() => foo()).not.toThrow();
    });
  });

  describe('함수 호이스팅', () => {
    it('function 키워드를 이용한 함수 선언문은 호이스팅에 의해 함수 정의 전에 함수를 사용해도 예외를 던지지 않는다.', () => {
      expect(foo).not.toBe(undefined);
      expect(() => foo()).not.toThrow();

      function foo() {}
    });

    it('함수 표현식은 호이스팅이 일어나지 않아 함수 정의 전에 함수를 사용하면 예외를 던진다.', () => {
      expect(() => foo()).toThrow();

      const foo = () => {};
    });
  });

  describe('함수 == 객체', () => {
    it('함수에 프로퍼티를 추가할 수 있다.', () => {
      const foo = () => {};
      foo.prop = 'hi';

      expect(foo.prop).toBe('hi');
    });

    it('함수는 __proto__ 프로퍼티를 가진다.', () => {
      const foo = () => {};

      expect('__proto__' in foo).toBe(true);
    });
  });

  describe('함수 기본 프로퍼티', () => {
    it('함수는 name, caller, arguments, length 프로퍼티를 가진다.', () => {
      const foo = () => {};

      expect('name' in foo).toBe(true);
      expect('arguments' in foo).toBe(true);
      expect('length' in foo).toBe(true);
    });

    it('name 프로퍼티는 함수의 이름을 나타낸다.', () => {
      const foo = () => {};

      expect(foo.name).toBe('foo');
    });

    it('length 프로퍼티는 함수가 정상적으로 실행될 때 함수의 인자 개수를 나타낸다.', () => {
      const foo = () => {};

      expect(foo.length).toBe(0);
    });

    it('rest(...) 문법은 함수의 인자를 배열로 받는다.', () => {
      const sum = (a: number, b: number): number => a + b;
      const sumAll = (...args: number[]): number => args.reduce((acc, curr) => acc + curr, 0);

      // @ts-ignore
      expect(sum(1, 2, 3, 4, 5)).toBe(3);
      expect(sumAll(1, 2, 3, 4, 5)).toBe(15);
    });

    it('생성자 함수는 prototype 프로퍼티를 가진다.', () => {
      function Foo() {}

      expect('prototype' in Foo).toBe(true);
    });
  });
});
