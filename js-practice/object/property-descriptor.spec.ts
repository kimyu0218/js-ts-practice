describe('object property flag', () => {
  it('객체의 프로퍼티는 writable, enumerable, configurable 플래그를 가지며, 리터럴 방식으로 프로퍼티를 정의할 때 플래그를 별도로 설정하지 않으면 모두 true로 기본 설정된다.', () => {
    const foo = { name: 'foo' };

    expect(Object.getOwnPropertyDescriptor(foo, 'name')).toEqual({
      value: 'foo',
      writable: true,
      enumerable: true,
      configurable: true,
    });
  });

  describe('Object.defineProperty() & Object.defineProperties()', () => {
    it('writable 플래그가 false로 설정된 경우, 프로퍼티 값을 변경할 수 없다.', () => {
      const foo = {};
      Object.defineProperty(foo, 'name', {
        value: 'foo',
        writable: false,
      });

      // @ts-ignore
      expect(() => (foo.name = 'bar')).toThrow();
    });

    it('enumerable 플래그가 false로 설정된 경우, 해당 프로퍼티는 반복문이나 Object.keys()에서 제외된다.', () => {
      const foo = {};
      Object.defineProperty(foo, 'name', {
        value: 'foo',
        enumerable: false,
      });

      expect(Object.keys(foo).find((prop) => prop === 'name')).not.toBeDefined();
    });

    it('configurable 플래그가 false로 설정된 경우, 프로퍼티를 삭제할 수 없다.', () => {
      const foo = {};
      Object.defineProperty(foo, 'name', {
        value: 'foo',
        configurable: false,
      });

      // @ts-ignore
      expect(() => delete foo.name).toThrow();
    });

    it('Object.defineProperties()를 이용한 복제는 프로퍼티 플래그를 유지하지만, 객체 리터럴 복사는 플래그 값을 복사하지 않는다.', () => {
      const foo = {};
      Object.defineProperty(foo, 'name', {
        value: 'foo',
        writable: true,
        enumerable: true,
      });
      const fooClone1 = Object.defineProperties({}, Object.getOwnPropertyDescriptors(foo));
      const fooClone2 = Object.keys(foo).reduce((acc, curr) => {
        // @ts-ignore
        acc[curr] = foo[curr];
        return acc;
      }, {});

      expect(Object.getOwnPropertyDescriptor(fooClone1, 'name')).toEqual({
        value: 'foo',
        writable: true,
        enumerable: true,
        configurable: false,
      });
      // @ts-ignore
      expect(Object.getOwnPropertyDescriptor(fooClone2, 'name')).toEqual({
        value: 'foo',
        writable: true,
        enumerable: true,
        configurable: true,
      });
    });
  });

  describe('object sealing', () => {
    it('Object.preventExtensions()을 사용하면 객체에 새로운 프로퍼티를 정의하여 확장할 수 없다.', () => {
      const foo = { name: 'foo' };
      Object.preventExtensions(foo);

      // @ts-ignore
      expect(() => (foo.age = 20)).toThrow();
    });

    it('Object.seal()을 사용하면 프로퍼티 추가/삭제가 불가능하다.', () => {
      const foo = { name: 'foo' };
      Object.seal(foo);

      expect(Object.getOwnPropertyDescriptor(foo, 'name')?.configurable).toBe(false);
      // @ts-ignore
      expect(() => (foo.age = 20)).toThrow();
      // @ts-ignore
      expect(() => delete foo.name).toThrow();
    });

    it('Object.freeze()를 사용하면 프로퍼티 추가/수정/삭제가 모두 불가능하다.', () => {
      const foo = { name: 'foo' };
      Object.freeze(foo);

      expect(Object.getOwnPropertyDescriptor(foo, 'name')?.configurable).toBe(false);
      expect(Object.getOwnPropertyDescriptor(foo, 'name')?.writable).toBe(false);
      // @ts-ignore
      expect(() => (foo.age = 20)).toThrow();
      // @ts-ignore
      expect(() => delete foo.name).toThrow();
      expect(() => (foo.name = 'bar')).toThrow();
    });
  });

  it('Object.isExtensible()로 객체 확장 가능 여부를 확인할 수 있다.', () => {
    const foo1 = { name: 'foo' };
    const foo2 = { name: 'foo' };
    Object.preventExtensions(foo1);

    expect(Object.isExtensible(foo1)).toBe(false);
    expect(Object.isExtensible(foo2)).toBe(true);
  });

  it('Object.isSealed()로 객체 봉인 여부를 확인할 수 있다.', () => {
    const foo1 = { name: 'foo' };
    const foo2 = { name: 'foo' };
    Object.seal(foo1);

    expect(Object.isSealed(foo1)).toBe(true);
    expect(Object.isSealed(foo2)).toBe(false);
  });

  it('Object.isFrozen()로 객체 동결 여부를 확인할 수 있다.', () => {
    const foo1 = { name: 'foo' };
    const foo2 = { name: 'foo' };
    Object.freeze(foo1);

    expect(Object.isFrozen(foo1)).toBe(true);
    expect(Object.isFrozen(foo2)).toBe(false);
  });
});
