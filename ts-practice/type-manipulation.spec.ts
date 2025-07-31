describe('type manipulation', () => {
  it('제네릭에 제약을 둘 수 있다.', () => {
    function getProperty<T, K extends keyof T>(target: T, prop: K) {
      return target[prop];
    }
    const foo = { name: 'foo', age: 20 };

    expect(getProperty(foo, 'name')).toBe('foo');
    expect(getProperty(foo, 'age')).toBe(20);
  });

  describe('type operator', () => {
    it('keyof 연산자를 사용하면 객체의 키만 허용하는 유니온 타입을 만들 수 있다.', () => {
      type Coordinate = { x: number; y: number };
      type Axis = keyof Coordinate;
      let axis: Axis;

      expect(() => (axis = 'x')).not.toThrow();
      expect(() => (axis = 'y')).not.toThrow();
      // axis = 'z'; // Error
    });

    it('typeof 연산자를 사용하면 값에서 타입을 추론해 타입 정의에 활용할 수 있다.', () => {
      const str = 'foo';
      function FooFunc() {
        return { name: 'foo', age: 20 };
      }
      type BarFunc = () => 'bar';
      type Foo = ReturnType<typeof FooFunc>;
      type Bar = ReturnType<BarFunc>;
      let foo: Foo;
      let bar: Bar;

      expect(typeof str).toBe('string');
      expect(() => (foo = { name: 'foo1', age: 21 })).not.toThrow();
      expect(() => (bar = 'bar')).not.toThrow();
      // foo = { name: 'foo1' }; // Error
      // bar = 'foo'; // Error
    });

    it('indexed access type을 사용하면 객체 타입에서 특정 프로퍼티의 타입만을 추출할 수 있다.', () => {
      type Foo = { name: string; age: number };
      type FooName = Foo['name'];
      type FooAge = Foo['age'];
      type FooUnion1 = Foo['name' | 'age'];
      type FOoUnion2 = Foo[keyof Foo];
      let fooName: FooName;
      let fooAge: FooAge;
      let fooUnion1: FooUnion1;
      let fooUnion2: FOoUnion2;

      expect(() => (fooName = 'foo')).not.toThrow();
      expect(() => (fooAge = 20)).not.toThrow();
      expect(() => {
        fooUnion1 = 'foo';
        fooUnion1 = 20;
      }).not.toThrow();
      expect(() => {
        fooUnion2 = 'foo';
        fooUnion2 = 20;
      }).not.toThrow();
      // fooName = 20; // Error
      // fooAge = 'foo'; // Error
    });

    describe('conditional type', () => {
      it('conditional type과 indexed access type을 사용하여 타입을 추출할 수 있다.', () => {
        interface Animal {
          cry: unknown;
          sleep: unknown;
        }
        type CryOf<T extends Animal> = T['cry'];
        type SleepOf<T extends Animal> = T['sleep'];
        interface Cat {
          cry: 'yum';
          sleep: string;
        }
        let catCry: CryOf<Cat>;
        let catSleep: SleepOf<Cat>;

        expect(() => (catCry = 'yum')).not.toThrow();
        expect(() => (catSleep = 'zzz')).not.toThrow();
        // catCry = 'yummy'; // Error
        // catSleep = 20; // Error
      });

      it('conditional type과 infer를 사용하여 배열 요소의 타입이나 함수 반환 타입을 추출할 수 있다.', () => {
        type Flatten<T> = T extends Array<infer Item> ? Item : T;
        type GetReturnType<T> = T extends (...args: any[]) => infer Return ? Return : never;
        type StrType = Flatten<string[]>;
        type NumType = GetReturnType<() => number>;
        let str: StrType;
        let num: NumType;

        expect(() => (str = 'string')).not.toThrow();
        expect(() => (num = 20)).not.toThrow();
      });
    });
  });
});
