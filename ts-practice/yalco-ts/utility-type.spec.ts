describe('utility type', () => {
  it('Partial은 모든 프로퍼티를 선택적 프로퍼티로 만든다.', () => {
    interface Person {
      name: string;
      age: number;
    }

    expect(() => {
      const person: Partial<Person> = {};
    }).not.toThrow();
  });

  it('Required는 모든 프로퍼티를 필수 프로퍼티로 만든다.', () => {
    interface Person {
      name?: string;
      age?: number;
    }

    expect(() => {
      const person: Required<Person> = {
        name: 'foo',
        age: 20,
      };
    }).not.toThrow();
  });

  it('Pick은 특정 프로퍼티만 추출한 객체 타입을 만든다.', () => {
    interface Person {
      name: string;
      age: number;
    }
    const person1: Pick<Person, 'name'> = {
      name: 'foo',
    };
    const person2: Pick<Person, 'age'> = {
      age: 20,
    };

    expect('name' in person1).toBe(true);
    expect('age' in person1).toBe(false);
    expect('name' in person2).toBe(false);
    expect('age' in person2).toBe(true);
  });

  it('Omit은 특정 프로퍼티만 제거한 객체 타입을 만든다.', () => {
    interface Person {
      name: string;
      age: number;
    }
    const person1: Omit<Person, 'age'> = {
      name: 'foo',
    };
    const person2: Omit<Person, 'name'> = {
      age: 20,
    };

    expect('name' in person1).toBe(true);
    expect('age' in person1).toBe(false);
    expect('name' in person2).toBe(false);
    expect('age' in person2).toBe(true);
  });

  it('Exclude는 유니온 타입에서 특정 타입을 제거한 타입을 만든다.', () => {
    type Color = 'red' | 'green' | 'blue';
    let redOrGreen: Exclude<Color, 'blue'>;

    expect(() => (redOrGreen = 'red')).not.toThrow();
    expect(() => (redOrGreen = 'green')).not.toThrow();
    // redOrGreen = 'blue'; // Error
  });

  it('Extract는 유니온 타입들의 공통 요소만 추출한 타입을 만든다.', () => {
    type Color1 = 'red' | 'green' | 'blue';
    type Color2 = 'red' | 'orange' | 'yellow';
    type CommonColor = Extract<Color1, Color2>;
    let commonColor: CommonColor;

    expect(() => (commonColor = 'red')).not.toThrow();
    // commonColor = 'green'; // Error
    // commonColor = 'orange'; // Error
  });

  it('NonNullable은 null과 undefined를 제외한 타입을 만든다.', () => {
    type StringOrNull = string | null | undefined;
    type SafeString = NonNullable<StringOrNull>;
    let safeString: SafeString;

    expect(() => (safeString = 'foo')).not.toThrow();
    // safeString = null; // Error
    // safeString = undefined; // Error
  });

  it('Parameters & ReturnType & ConstructorParameters', () => {
    function createPerson(name: string, age: number) {
      return { name, age };
    }
    class Person {
      constructor(private name: string, private age: number) {}
    }
    type CreatePersonParams = Parameters<typeof createPerson>;
    type CreatePersonReturnType = ReturnType<typeof createPerson>;
    type PersonConstructorParams = ConstructorParameters<typeof Person>;

    expect(() => {
      const params: CreatePersonParams = ['foo', 20];
    }).not.toThrow();
    expect(() => {
      const returnType: CreatePersonReturnType = { name: 'foo', age: 20 };
    }).not.toThrow();
    expect(() => {
      const params: PersonConstructorParams = ['foo', 20];
    }).not.toThrow();
  });
});
