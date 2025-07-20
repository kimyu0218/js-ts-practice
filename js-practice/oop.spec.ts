describe('OOP', () => {
  it('자바스크립트는 prototype에 인스턴스가 공통으로 사용하는 메서드를 정의할 수 있다.', () => {
    function Foo(name: string) {
      // @ts-ignore
      this.name = name;
    }
    Foo.prototype.getName = function (): string {
      return this.name;
    };
    Foo.prototype.setName = function (name: string) {
      this.name = name;
    };

    // @ts-ignore
    const foo1 = new Foo('foo1');
    // @ts-ignore
    const foo2 = new Foo('foo2');

    expect(foo1.getName).toBe(Foo.prototype.getName);
    expect(foo1.getName).toBe(foo2.getName);
    expect(foo1.setName).toBe(foo2.setName);
  });

  it('프로토타입을 이용하여 상속을 구현할 수 있다.', () => {
    function createInstance(object: object) {
      function F() {}
      F.prototype = object;
      // @ts-ignore
      return new F();
    }
    const foo = {
      name: 'foo',
      getName(): string {
        return this.name;
      },
      setName(name: string): void {
        this.name = name;
      },
    };

    const foo1 = createInstance(foo);
    const foo2 = createInstance(foo);
    foo2.setName('foo2');

    expect(foo1.__proto__).toBe(foo);
    expect(foo2.__proto__).toBe(foo);
    expect(foo1.getName()).toBe('foo');
    expect(foo2.getName()).toBe('foo2');
  });

  it('클래스(생성자 함수)를 이용하여 상속을 구현할 수 있다.', () => {
    function Person(name: string) {
      // @ts-ignore
      this.name = name;
    }
    Person.prototype.getName = function () {
      return this.name;
    };
    Person.prototype.setName = function (name: string) {
      this.name = name;
    };
    function Student() {}

    // @ts-ignore
    Student.prototype = new Person('person');
    // @ts-ignore
    const foo = new Student();
    foo.setName('foo');

    expect(foo.__proto__.getName).toBe(Person.prototype.getName);
    expect(foo.__proto__.setName).toBe(Person.prototype.setName);
    expect(foo.getName()).toBe('foo');
  });

  it('클로저를 이용하여 캡슐화를 구현할 수 있다.', () => {
    function Foo() {
      let foo = 'foo';

      return {
        getFoo: function () {
          return foo;
        },
      };
    }

    // @ts-ignore
    const foo = new Foo();

    expect('foo' in foo).toBe(false);
    expect(foo.getFoo()).toBe('foo');
  });
});
