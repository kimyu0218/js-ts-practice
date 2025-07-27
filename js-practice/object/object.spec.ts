import _ from 'lodash';

describe('object', () => {
  describe('plain object', () => {
    it('객체 리터럴과 Object 생성자는 모두 객체를 생성한다.', () => {
      const obj1 = {};
      const obj2 = new Object();

      expect(typeof obj1).toBe('object');
      expect(typeof obj2).toBe('object');
    });

    it('객체의 프로퍼티를 추가/삭제할 수 있다.', () => {
      const obj = {
        name: 'foo',
      };

      // @ts-ignore
      obj.age = 20;
      // @ts-ignore
      delete obj.name;

      expect('age' in obj).toBe(true);
      expect('name' in obj).toBe(false);
    });

    it('객체의 프로퍼티 키를 동적으로 정의할 수 있다.', () => {
      const name = 'foo';
      const obj = {
        [name]: 'foo',
      };

      expect('foo' in obj).toBe(true);
    });

    it('객체의 프로퍼티 키는 숫자형이더라도 문자열로 처리된다.', () => {
      const obj = {
        0: '',
      };

      expect('0' in obj).toBe(true);
      expect(0 in obj).toBe(true);
    });
  });

  describe('object cloning', () => {
    it('동일한 객체를 참조하면 주소가 같으므로 == 비교는 true를 반환한다.', () => {
      const a = {};
      const b = a;

      expect(a == b).toBe(true);
    });

    it('구조는 같지만 서로 다른 객체는 주소가 다르므로 == 비교 시 false를 반환한다.', () => {
      const a = {};
      const b = {};

      expect(a == b).toBe(false);
    });

    it('얕은 복사된 객체는 최상위 객체 기준으로 == 비교 시 서로 다른 참조이므로 false를 반환한다.', () => {
      let fooClone = {};
      const foo = {
        name: 'foo',
      };
      // @ts-ignore
      Object.assign(fooClone, foo);

      expect(foo == fooClone).toBe(false);
    });

    it('얕은 복사된 객체 내부의 중첩 객체는 동일한 참조이므로 == 비교 시 true를 반환한다.', () => {
      let fooClone = {};
      const foo = {
        info: {
          name: 'foo',
          age: 20,
        },
      };
      // @ts-ignore
      Object.assign(fooClone, foo);

      // @ts-ignore
      expect(foo.info == fooClone.info).toBe(true);
    });

    it('깊은 복사된 객체 내부의 중첩 객체는 새로운 참조이므로 == 비교 시 false를 반환한다.', () => {
      const foo = {
        info: {
          name: 'foo',
          age: 20,
        },
      };
      const fooClone = _.cloneDeep(foo);

      // @ts-ignore
      expect(foo.info == fooClone.info).toBe(false);
    });
  });

  describe('method', () => {
    it('this는 메서드를 호출한 주체이 따라 런타임에 동적으로 결정된다.', () => {
      const foo = {
        name: 'foo',
        sayName() {
          return this.name;
        },
      };

      expect(foo.sayName()).toBe('foo');
    });

    it('this 대신 객체를 직접 참조하면 런타임에 참조가 끊겨 오류가 발생할 수 있다.', () => {
      let foo = {
        name: 'foo',
        sayName() {
          return foo.name;
        },
      };
      const foo2 = foo;
      // @ts-ignore
      foo = null;

      expect(() => foo2.sayName()).toThrow();
    });
  });

  describe('prototype', () => {
    it('객체의 [[Prototype]]은 Object.prototype이다.', () => {
      const obj = {};

      // @ts-ignore
      expect(obj.__proto__).toBe(Object.prototype);
      // @ts-ignore
      expect(obj.__proto__.toString).toBe(Object.prototype.toString);
    });

    it('내장 객체의 [[Prototype]]은 Object.prototype이다.', () => {
      // @ts-ignore
      expect(Array.prototype.__proto__).toBe(Object.prototype);
      // @ts-ignore
      expect(String.prototype.__proto__).toBe(Object.prototype);
      // @ts-ignore
      expect(Function.prototype.__proto__).toBe(Object.prototype);
      // @ts-ignore
      expect(Map.prototype.__proto__).toBe(Object.prototype);
    });
  });
});
