describe('type manipulation', () => {
  it('제네릭에 제약을 둘 수 있다.', () => {
    function getProperty<T, K extends keyof T>(target: T, prop: K) {
      return target[prop];
    }
    const foo = { name: 'foo', age: 20 };

    expect(getProperty(foo, 'name')).toBe('foo');
    expect(getProperty(foo, 'age')).toBe(20);
  });

  describe('type operator', () => {
    it('keyof', () => {
      type Coordinate = { x: number; y: number };
      type Axis = keyof Coordinate;
      let axis: Axis;

      expect(() => (axis = 'x')).not.toThrow();
      expect(() => (axis = 'y')).not.toThrow();
    });
  });
});
