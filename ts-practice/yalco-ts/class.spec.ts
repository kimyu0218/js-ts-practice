describe('class', () => {
  it('public은 어디서든 접근할 수 있고, protected는 자식 클래스에서만 접근 가능하며, private은 클래스 내부에서만 접근할 수 있다.', () => {
    class User {
      public id: number;
      protected email: string;
      private password: string;

      constructor(id: number, email: string, password: string) {
        this.id = id;
        this.email = email;
        this.password = password;
      }
    }
    class Admin extends User {
      constructor(id: number, email: string, password: string) {
        super(id, email, password);
      }

      getInfo() {
        return {
          id: this.id,
          //   password: this.password, // Error
          email: this.email,
        };
      }
    }
    const admin = new Admin(1, 'admin@example.com', 'passwd');

    expect(admin.id).toBe(1);
    expect(admin.getInfo()).toEqual({ id: 1, email: 'admin@example.com' });
    // admin.email; // Error
  });

  it('생성자 파라미터에 접근 제어자를 붙이면, 자동으로 해당 프로퍼티가 선언되고 초기화되어 생성자 로직을 간결하게 만들 수 있다.', () => {
    class User {
      constructor(public id: number, protected email: string, private password: string) {}
    }
    const user = new User(1, 'test@example.com', 'passwd');

    expect(user.id).toBe(1);
  });

  describe('추상 클래스', () => {
    it('추상 클래스는 직접 인스턴스화할 수는 없지만, 하위 클래스는 인스턴스화할 수 있다.', () => {
      abstract class Animal {
        move() {}
      }
      class Cat extends Animal {
        meow(): string {
          return 'meow-!';
        }
      }

      expect(() => {
        const cat = new Cat();
      }).not.toThrow();
      // new Animal(); // Error
    });

    it('추상 클래스에 선언된 abstract 메서드는 자식 클래스가 해당 메서드를 반드시 구현하도록 강제한다.', () => {
      abstract class Shape {
        abstract getArea(): number;
      }
      class Circle extends Shape {
        constructor(private radius: number) {
          super();
        }

        getArea(): number {
          return Math.PI * Math.pow(this.radius, 2);
        }
      }
      class Rectangle extends Shape {
        constructor(private width: number, private height: number) {
          super();
        }

        getArea(): number {
          return this.width * this.height;
        }
      }
      const circle = new Circle(1);
      const rectangle = new Rectangle(1, 3);

      expect(circle.getArea()).toBe(Math.PI);
      expect(rectangle.getArea()).toBe(3);
    });
  });
});
