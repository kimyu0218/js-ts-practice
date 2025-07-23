describe('number', () => {
  it('toString()는 숫자를 n진수 문자열로 변환한다.', () => {
    const num = 15;

    expect(num.toString(2)).toBe('1111');
    expect(num.toString(16)).toBe('f');
  });

  it('toFixed()는 소수점 이하 n자리까지 문자열로 반환한다.', () => {
    const pi = 3.141592;

    expect(pi.toFixed(2)).toBe('3.14');
    expect(pi.toFixed(0)).toBe('3');
  });

  it('parseInt()와 parseFloat()는 문자열 앞에서부터 숫자를 파싱하여 반환한다.', () => {
    expect(parseInt('16px')).toBe(16);
    expect(parseInt('a123')).toBeNaN();
    expect(parseFloat('3.14rad')).toBe(3.14);
  });
});
