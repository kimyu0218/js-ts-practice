describe('any vs. unknown', () => {
  describe('any', () => {
    it('any는 어떤 값이든 자유롭게 할당할 수 있다.', () => {
      let foo: any = 'foo';

      expect(() => (foo = 1)).not.toThrow();
      expect(() => (foo = [1, 2, 3])).not.toThrow();
      expect(() => (foo = true)).not.toThrow();
    });

    it('변수 선언만 하고 값을 할당하지 않으면 any 타입이 된다.', () => {
      let foo;

      expect(() => (foo = 1)).not.toThrow();
      expect(() => (foo = [1, 2, 3])).not.toThrow();
      expect(() => (foo = true)).not.toThrow();
    });

    it('any 타입은 타입 검사를 수행하지 않기 때문에 존재하지 않는 속성에 접근할 경우 런타임 예외가 발생할 수 있다.', () => {
      const foo: any = 1;

      expect(() => foo.toUpperCase()).toThrow();
      expect(() => foo.helloBar()).toThrow();
    });
  });

  describe('unknown', () => {
    it('unknown 타입은 타입 검사 없이 다른 타입의 변수에 값을 할당할 수 없다.', () => {
      const foo: unknown = 10;
      let bar: number;

      expect(() => {
        if (typeof foo === 'number') {
          bar = foo;
        }
      }).not.toThrow();
      // bar = foo; // Error
    });
  });
});
