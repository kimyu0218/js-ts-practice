describe('generator', () => {
  it('제너레이터는 next() 호출 시 순차적으로 값과 종료 여부를 반환한다.', () => {
    function* generator() {
      yield 1;
      yield 2;
      return 3;
    }
    const gen = generator();

    expect(gen.next()).toEqual({ value: 1, done: false });
    expect(gen.next()).toEqual({ value: 2, done: false });
    expect(gen.next()).toEqual({ value: 3, done: true });
  });

  it('for...of는 제너레이터의 return 값은 순회하지 않는다.', () => {
    function* generator() {
      yield 1;
      yield 2;
      return 3;
    }
    const gen = generator();

    // @ts-ignore
    const actual = [];
    for (const val of gen) {
      actual.push(val);
    }

    expect(actual.length).toBe(2);
    expect(actual).toEqual([1, 2]);
  });
});
