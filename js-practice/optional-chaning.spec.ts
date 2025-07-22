describe('optional chaining', () => {
  it('?.은 왼쪽의 값이 null 이나 undefined이면 예외 대신 undefined를 반환한다.', () => {
    const foo = {};

    // @ts-ignore
    expect(() => foo.info.name).toThrow();
    // @ts-ignore
    expect(foo.info?.name).toBe(undefined);
  });

  it('?.은 함수가 존재하지 않을 경우, 호출을 생략하고 예외 대신 undefined를 반환한다.', () => {
    const foo = {};

    // @ts-ignore
    expect(() => foo.sayHi()).toThrow();
    // @ts-ignore
    expect(() => foo.sayHi?.()).not.toThrow();
  });
});
