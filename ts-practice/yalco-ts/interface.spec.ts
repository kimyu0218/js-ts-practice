describe('interface', () => {
  it('인터페이스의 ?를 붙여 옵셔널 프로퍼티를 정의할 수 있다.', () => {
    interface Product {
      name: string;
      price: number;
      description?: string;
    }
    const product1: Product = {
      name: 'iPhone',
      price: 150,
    };
    const product2: Product = {
      name: 'MacBook Pro 14',
      price: 350,
      description: 'm4',
    };

    expect(product1.description).toBeUndefined();
    expect(product2.description).toBe('m4');
  });

  it('readonly 프로퍼티는 수정될 수 없다.', () => {
    interface Address {
      readonly macAddr: string;
      ipAddr: string;
    }
    const addr: Address = {
      macAddr: '00:1A:2B:3C:4D:5E',
      ipAddr: '127.0.0.1',
    };

    expect(() => (addr.ipAddr = '192.168.0.1')).not.toThrow();
    // add.macAddr = '00:1A:2B:3C:4D:5F'; // Error
  });

  it('인덱스 시그니처를 이용하여 특정 타입을 키로 갖는 객체를 정의할 수 있다.', () => {
    interface PhoneBook {
      [name: string]: string;
    }

    expect(() => {
      const phones: PhoneBook = {
        Alice: '010-1234-5678',
        Bob: '010-8765-4321',
      };
    }).not.toThrow();
  });

  it('Mapped Type을 이용하여 특정 값을 키로 갖는 객체를 정의할 수 있다.', () => {
    type AllowedKeys = 'English' | 'Math' | 'Science';
    type Scores = {
      [K in AllowedKeys]: number;
    };

    expect(() => {
      const scores: Scores = {
        English: 100,
        Math: 80,
        Science: 90,
      };
    }).not.toThrow();
  });

  it('인터페이스는 상속을 통해 확장할 수 있으며, 다중 상속도 가능하다.', () => {
    interface Animal {
      move: () => void;
    }
    interface Dog extends Animal {
      bark: () => void;
    }
    interface Pet {
      name: string;
    }
    interface CompanionDog extends Dog, Pet {}

    expect(() => {
      const dog: CompanionDog = {
        bark(): void {
          console.log('bark bark!');
        },
        move(): void {},
        name: 'Rina',
      };
    }).not.toThrow();
  });

  it('동일한 이름의 인터페이스는 병합되어 하나로 취급된다.', () => {
    interface ApiResponse {
      status: number;
      data: any;
    }
    interface ApiResponse {
      headers: { [key: string]: string };
    }

    expect(() => {
      const res: ApiResponse = {
        status: 200,
        data: 'Ok',
        headers: { 'Content-Type': 'application/json' },
      };
    }).not.toThrow();
  });

  it('인터페이스는 초과 프로퍼티 검사를 수행하지만, 우회하는 것도 가능하다.', () => {
    interface Account {
      id: string;
      nickname: string;
    }
    const account1: Account = {
      id: 'test@example.com',
      nickname: '홍길동',
      //   description: '안녕, 나는 홍길동이야.', // Error
    };
    const account2 = {
      id: 'test2@example.com',
      nickname: '홍길동2',
      description: '안녕, 나는 홍길동2야.',
    };

    expect(() => {
      const account3: Account = account2;
    }).not.toThrow();
  });

  it('Mapped Type을 이용해 특정 속성을 읽기 전용 또는 선택적으로 만들 수 있다.', () => {
    interface Account {
      id: string;
      nickname: string;
    }
    type ReadonlyType<T extends Record<string, any>> = {
      readonly [K in keyof T]: T[K];
    };
    type PartialType<T extends Record<string, any>> = {
      [K in keyof T]?: T[K];
    };

    expect(() => {
      const account: ReadonlyType<Account> = {
        id: 'test@example.com',
        nickname: '홍길동',
      };
      //   account.nickname = '홍길동2'; // Error
    }).not.toThrow();
    expect(() => {
      const account: PartialType<Account> = {};
      account.id = 'test@example.com';
      account.nickname = '홍길동';
      //   account.hello = () => console.log('안녕'); // Error
    }).not.toThrow();
  });
});
