describe('void vs. never', () => {
  it('void 타입은 명시적으로 값을 반환하지 않는 함수의 반환 타입을 나타낸다.', () => {
    const printStrLength = (str: string | null): void => {
      if (str === null) {
        return;
      }
      console.log(str.length);
    };

    expect(printStrLength('hello')).toBeUndefined();
  });

  it('never 타입은 함수가 절대 반환되지 않는다는 것을 의미하며, 주로 예외를 던지거나 무한 루프를 도는 함수에 사용된다.', () => {
    const throwError = (): never => {
      throw new Error('This does not return result!');
    };

    expect(() => throwError()).toThrow();
  });
});
