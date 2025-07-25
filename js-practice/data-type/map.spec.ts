describe('map', () => {
  it('Object.fromEntries()를 통해 Map을 Object로 변환할 수 있다.', () => {
    const map = new Map([
      ['apple', 1],
      ['banana', 2],
      ['orange', 4],
    ]);

    const obj = Object.fromEntries(map);

    expect(obj).toEqual({
      apple: 1,
      banana: 2,
      orange: 4,
    });
  });

  it('Object.entries()를 통해 Object를 Map으로 변환할 수 있다.', () => {
    const obj = {
      apple: 1,
      banana: 2,
      orange: 4,
    };

    const map = new Map(Object.entries(obj));

    expect(map.get('apple')).toBe(1);
    expect(map.get('banana')).toBe(2);
    expect(map.get('orange')).toBe(4);
  });
});

describe('week map', () => {
  it('WeakMap은 오직 Object만 key로 사용할 수 있다.', () => {
    const weakMap = new WeakMap();

    expect(() => weakMap.set({ name: 'foo' }, 'foo')).not.toThrow();
    // @ts-ignore
    expect(() => weakMap.set('foo', 'foo')).toThrow();
  });
});
