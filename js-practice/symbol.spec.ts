describe('symbol', () => {
  it('Symbol()로 생성된 심볼은 고유한 값을 가진다.', () => {
    const sym1 = Symbol('foo');
    const sym2 = Symbol('foo');

    // @ts-ignore
    expect(sym1 === sym2).toBe(false);
  });

  it('Symbol.for()은 동일한 key에 대해 전역에서 동일한 심볼을 반환한다.', () => {
    const sym1 = Symbol.for('foo');
    const sym2 = Symbol.for('foo');

    // @ts-ignore
    expect(sym1 === sym2).toBe(true);
  });

  it('Symbol.keyFor()은 전역 심볼의 key를 반환한다.', () => {
    const sym = Symbol.for('foo');

    expect(Symbol.keyFor(sym)).toBe('foo');
  });

  it('심볼 키로 정의된 프로퍼티는 Object.getOwnPropertyNames()로는 조회할 수 없다.', () => {
    const sym = Symbol('foo');
    const foo = {
      [sym]: 'foo',
    };

    expect(sym in foo).toBe(true);
    expect(Object.getOwnPropertySymbols(foo)).toContain(sym);
    expect(Object.getOwnPropertyNames(foo)).not.toContain(sym);
  });
});
