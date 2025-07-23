import { indexOf } from 'lodash';

describe('string', () => {
  it('[]과 charAt()으로 문자열에서 특정 위치의 문자를 가져온다.', () => {
    const str = 'Hello World';

    expect(str[0]).toBe('H');
    expect(str.charAt(0)).toBe('H');
  });

  it('문자열은 불변하므로 수정할 수 없다.', () => {
    const str = 'Hello World';

    // @ts-ignore
    expect(() => (str[0] = 'h')).toThrow();
  });

  it('대소문자로 변환한다.', () => {
    expect('FOO'.toLowerCase()).toBe('foo');
    expect('foo'.toUpperCase()).toBe('FOO');
  });

  it('indexOf()와 lastIndexOf()로 특정 문자열의 위치를 찾을 수 있다.', () => {
    const foo = 'foo';

    expect(foo.indexOf('f')).toBe(0);
    expect(foo.indexOf('a')).toBe(-1);
    expect(foo.indexOf('o')).toBe(1);
    expect(foo.indexOf('o', 2)).toBe(2);
    expect(foo.lastIndexOf('o')).toBe(2);
    expect(foo.lastIndexOf('o', 1)).toBe(1);
  });

  it('includes(), startsWith(), endsWith()을 통해 문자열 포함 여부를 확인한다.', () => {
    const str = 'Hello World';

    expect(str.includes('Hello')).toBe(true);
    expect(str.includes('Bye')).toBe(false);
    expect(str.includes('Hello', 1)).toBe(false);
    expect(str.startsWith('Hello')).toBe(true);
    expect(str.startsWith('Bye')).toBe(false);
    expect(str.endsWith('World')).toBe(true);
    expect(str.endsWith('world')).toBe(false);
  });

  it('slice()와 substr()로 부분 문자열을 추출한다.', () => {
    const str = 'Hello World';

    expect(str.slice(1)).toBe('ello World');
    expect(str.slice(2, -1)).toBe('llo Worl');
    expect(str.substr(0, 5)).toBe('Hello');
    expect(str.substr(6, 5)).toBe('World');
  });
});
