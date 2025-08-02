describe('function', () => {
  it('?(옵셔널 파라미터)를 사용하면 생략이 허용되며, 기본값이 없는 경우 undefined가 전달된다.', () => {
    function sayHello(name?: string): string {
      return `Hello, ${name}!`;
    }

    expect(sayHello('foo')).toBe('Hello, foo!');
    expect(sayHello()).toBe('Hello, undefined!');
  });

  it('함수 오버로딩을 사용할 수 있다.', () => {
    function processInput(value: string): string;
    function processInput(value: number): number;
    function processInput(value: string | number): string | number {
      if (typeof value === 'string') {
        return value.toUpperCase();
      } else {
        return value * 2;
      }
    }

    expect(processInput('foo')).toBe('FOO');
    expect(processInput(1)).toBe(2);
  });
});
