describe('prototype chaining', () => {
  describe('prototype', () => {
    it('객체는 [[Prototype]]이라는 숨겨진 프로퍼티를 가지고 있으며, __proto__를 이용해 해당 프로퍼티에 접근할 수 있다.', () => {
      const foo = {};

      // @ts-ignore
      expect(foo.__proto__).not.toBeUndefined();
    });

    it('객체에 프로퍼티가 없는 경우 프로토타입에서 해당 프로퍼티를 가져오는데, 이를 프로토토입 상속이라고 한다.', () => {
      const animal = {
        eat: true,
      };
      const rabbit = {
        jump: true,
        __proto__: animal,
      };

      expect('eat' in rabbit).toBe(true);
    });

    it('상속받은 프로퍼티는 Object.keys()에 포함되지 않고 ownProperty도 아니다.', () => {
      const animal = {
        eat: true,
      };
      const rabbit = {
        jump: true,
        __proto__: animal,
      };

      expect(Object.keys(rabbit).find((key) => key === 'eat')).toBeUndefined();
      expect(rabbit.hasOwnProperty('eat')).toBe(false);
    });
  });

  describe('[[Prototype]] 변경', () => {
    it('[[Prototype]]을 다른 객체로 변경할 수 있다.', () => {
      function Foo(name: string) {
        // @ts-ignore
        this.name = name;
      }

      Foo.prototype = {
        country: 'korea',
      };
      // @ts-ignore
      const foo = new Foo();

      expect('country' in foo).toBe(true);
    });

    it('생성자 함수의 프로토타입이 변경되기 전에 생성된 객체들은 기존 프로토타입 객체로의 [[Prototype]]을 유지한다.', () => {
      function Foo(name: string) {
        // @ts-ignore
        this.name = name;
      }

      // @ts-ignore
      const foo = new Foo();
      Foo.prototype = {
        country: 'korea',
      };

      expect('country' in foo).toBe(false);
    });
  });

  describe('체이닝', () => {
    it('프로퍼티에 해당 객체에 없는 경우, 체이닝이 발생한다.', () => {
      function Foo(name: string) {
        // @ts-ignore
        this.name = name;
      }
      Foo.prototype.country = 'korea';

      // @ts-ignore
      const foo = new Foo('foo');

      expect(foo.country).toBe('korea');
    });

    it('객체에 존재하는 프로퍼티를 읽을 경우, 체이닝이 일어나지 않는다.', () => {
      function Foo(name: string) {
        // @ts-ignore
        this.name = name;
      }
      Foo.prototype.country = 'korea';

      // @ts-ignore
      const foo = new Foo('foo');
      foo.country = 'japan';

      expect(foo.country).toBe('japan');
    });
  });
});
