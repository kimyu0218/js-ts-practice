describe('types', () => {
  describe('interface vs. type', () => {
    it('interface는 extends로 확장한다.', () => {
      interface Animal {
        name: string;
      }

      expect(() => {
        interface Bear extends Animal {
          honey: boolean;
        }
      }).not.toThrow();
    });

    it('type은 교차 타입(&)으로 확장한다.', () => {
      type Animal = {
        name: string;
      };

      expect(() => {
        type Bear = Animal & {
          honey: boolean;
        };
      }).not.toThrow();
    });
  });

  it('union과 리터럴 타입을 사용하면 허용된 값 외의 다른 값을 대입할 수 없다.', () => {
    let animal: 'bear' | 'cat' | 'dog' = 'dog';
    // animal = 'fish'; // Error
  });

  describe('generic', () => {
    it('제네릭을 이용하면 입력과 리턴값 타입을 연관지을 수 있다.', () => {
      function getFirst<T>(arr: T[]): T {
        return arr[0];
      }

      expect(typeof getFirst([1, 2, 3])).toBe('number');
      expect(typeof getFirst(['a', 'b', 'c'])).toBe('string');
    });

    it('제네릭에 제약을 두면 특정 조건을 만족하는 타입만 허용한다.', () => {
      function longest<T extends { length: number }>(a: T, b: T): T {
        return a.length >= b.length ? a : b;
      }

      // longest(1, 2); // Error
    });

    it('제네릭을 이용해 객체의 프로퍼티 타입을 정의할 수 있다.', () => {
      interface Box<T> {
        contents: T;
      }
      const numBox: Box<number> = { contents: 0 };

      expect(typeof numBox.contents).toBe('number');
    });
  });

  it('인덱스 시그니처를 사용하여 키와 값의 타입을 제한할 수 있다.', () => {
    interface StringArray {
      [index: number]: string;
    }
    const strArr: StringArray = {};
    // strArr['foo'] = 'foo'; // Error
  });
});
