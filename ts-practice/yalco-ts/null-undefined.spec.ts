describe('null vs. undefined', () => {
  it('null과 undefined는 서로 다른 타입으로 간주된다.', () => {
    let foo: null;
    let bar: undefined;

    expect(() => (foo = null)).not.toThrow();
    expect(() => (bar = undefined)).not.toThrow();
    // foo = undefined; // Error
    // bar = null; // Error
  });
});
