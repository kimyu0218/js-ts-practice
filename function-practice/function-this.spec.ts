describe('function this binding', () => {
  it('메서드 내부에서 사용한 this는 해당 메서드를 호출한 객체로 바인딩된다.', () => {
    const foo = {
      name: 'foo',
      sayName(): string {
        return this.name;
      },
    };

    expect(foo.name).toBe('foo');
  });

  it('apply와 call을 사용하여 명시적으로 this를 바인딩할 수 있다.', () => {
    function Foo(name: string, age: number) {
      // @ts-ignore
      this.name = name;
      // @ts-ignore
      this.age = age;
    }

    const foo1 = {} as any;
    const foo2 = {} as any;
    Foo.apply(foo1, ['foo', 20]);
    Foo.call(foo2, 'foo', 20);

    expect(foo1).toEqual({ name: 'foo', age: 20 });
    expect(foo2).toEqual({ name: 'foo', age: 20 });
  });
});
