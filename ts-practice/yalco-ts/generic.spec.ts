describe('generic', () => {
  it('제네릭을 사용하면 컴파일 시점에 타입 관계를 유연하게 추론할 수 있다.', () => {
    function merge<T, U>(a: T, b: U): [T, U] {
      return [a, b];
    }
    const merged = merge('foo', true);

    expect(typeof merged[0]).toBe('string');
    expect(typeof merged[1]).toBe('boolean');
  });

  it('제네릭 제약을 이용하면 제약을 만족하는 타입만 허용할 수 있다.', () => {
    function getLength<T extends { length: number }>(value: T): number {
      return value.length;
    }

    expect(getLength('foo')).toBe(3);
    expect(getLength([1, 2, 3])).toBe(3);
    expect(getLength({ length: 1 })).toBe(1);
    // getLength(10); // Error
  });

  it('keyof를 사용하면 객체의 프로퍼티 이름만 타입으로 허용할 수 있다.', () => {
    function getProperty<T, K extends keyof T>(obj: T, prop: K): T[K] {
      return obj[prop];
    }
    const foo = { name: 'foo', age: 20 };

    expect(getProperty(foo, 'name')).toBe('foo');
    expect(getProperty(foo, 'age')).toBe(20);
    // getProperty(foo, 'bar'); // Error
  });

  it('조건부 타입을 사용하면 타입에 따라 달라지는 타입을 정의할 수 있다.', () => {
    type IsNumber<T> = T extends number ? true : false;
    type A = IsNumber<10>;
    type B = IsNumber<'foo'>;

    expect(() => {
      const a: A = true;
    }).not.toThrow();
    expect(() => {
      const b: B = false;
    }).not.toThrow();
  });

  it('infer를 사용하면 조건부 타입 내에서 타입 정보를 추론할 수 있다.', () => {
    type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
    type StringReturnType = MyReturnType<() => string>;
    type NumberReturnType = MyReturnType<() => number>;
    type NeverReturnType = MyReturnType<number>;

    expect(() => {
      const returnType: StringReturnType = 'foo';
    }).not.toThrow();
    expect(() => {
      const returnType: NumberReturnType = 10;
    }).not.toThrow();
    // const returnType: NeverReturnType = 10; // Error
  });
});
