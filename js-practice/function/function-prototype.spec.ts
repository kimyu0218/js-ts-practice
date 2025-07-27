describe('function prototype', () => {
  describe('prototype 프로퍼티', () => {
    it('prototype 프로퍼티는 constructor 프로퍼티 하나만 있는 객체를 가리킨다.', () => {
      function Foo() {}

      expect('constructor' in Foo.prototype).toBe(true);
      expect(Foo.prototype.constructor).toBe(Foo);
    });

    it('prototype 프로퍼티는 생성자 함수가 new와 함께 불렸을 때, 새로운 인스턴스에 [[Prototype]]으로 연결된다.', () => {
      const animal = {};
      function Rabbit(name: string) {
        // @ts-ignore
        this.name = name;
      }
      Rabbit.prototype = animal;
      // @ts-ignore
      const rabbit = new Rabbit('bunny');

      expect(rabbit.__proto__).toBe(animal);
    });
  });
});
