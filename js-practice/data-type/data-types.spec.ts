describe('data types', () => {
  describe('number', () => {
    it('자바스크립트에는 NaN, Infinity 같은 특별한 숫자 값이 있다.', () => {
      // @ts-ignore
      expect('not number' / 2).toBeNaN();
      expect(1 / 0).toBe(Infinity);
    });
  });

  describe('type conversion', () => {
    it('String(), Number(), Boolean() 함수를 이용해 자료형을 명시적으로 변환할 수 있다.', () => {
      expect(typeof String(0)).toBe('string');
      expect(typeof Number('0')).toBe('number');
      expect(typeof Boolean('')).toBe('boolean');
    });

    it('Number() 함수는 변환할 수 없는 값은 NaN을, true/false는 1/0을, 빈 문자열은 0으로 변환한다.', () => {
      expect(Number('not number')).toBeNaN();
      expect(Number(true)).toBe(1);
      expect(Number(false)).toBe(0);
      expect(Number('')).toBe(0);
    });

    it('Number() 함수는 null을 0으로, undefined를 NaN으로 변환한다.', () => {
      expect(Number(null)).toBe(0);
      expect(Number(undefined)).toBeNaN();
    });

    it('Boolean()은 "", null, undefined, NaN을 false로 변환한다.', () => {
      expect(Boolean('')).toBe(false);
      expect(Boolean(null)).toBe(false);
      expect(Boolean(undefined)).toBe(false);
      expect(Boolean(NaN)).toBe(false);
    });
  });

  describe('== vs. ===', () => {
    it('== 연산자는 피연산자를 숫자로 변환한 후 비교한다.', () => {
      // @ts-ignore
      expect('01' == 1).toBe(true);
      // @ts-ignore
      expect(true == 1).toBe(true);
    });

    it('=== 연산자는 피연산자의 타입을 변환하지 않고 비교한다.', () => {
      // @ts-ignore
      expect('01' === 1).toBe(false);
      // @ts-ignore
      expect(true === 1).toBe(false);
    });
  });

  describe('null & undefined', () => {
    it('null은 숫자 0으로 간주되지만, == 비교에서는 오직 undefined와만 같다.', () => {
      // @ts-ignore
      expect(null >= 0).toBe(true);
      // @ts-ignore
      expect(null <= 0).toBe(true);
      expect(null == 0).toBe(false);
    });

    it('undefined는 NaN으로 변환되므로 숫자와의 대소 비교나 == 비교에서 모두 false를 반환한다.', () => {
      // @ts-ignore
      expect(undefined > 0).toBe(false);
      // @ts-ignore
      expect(undefined == 0).toBe(false);
      // @ts-ignore
      expect(undefined < 0).toBe(false);
    });
  });
});
