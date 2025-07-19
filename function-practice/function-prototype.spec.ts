describe('function prototype', () => {
  describe('prototype 프로퍼티', () => {
    it('prototype 프로퍼티는 constructor 프로퍼티 하나만 있는 객체를 가리킨다.', () => {
      function Foo() {}

      const proto = Foo.prototype;

      expect('constructor' in proto).toBe(true);
      expect(proto.constructor).toBe(Foo);
    });

    it('prototype은 인스턴스의 [[Prototype]]으로 연결된다.', () => {
      function Foo() {}

      // @ts-ignore
      const foo = new Foo();

      expect(foo.__proto__).toBe(Foo.prototype);
    });
  });
});
