describe('logical operator', () => {
  describe('OR', () => {
    it('|| 연산은 하나라도 true이면 true를 반환한다.', () => {
      expect(true || true).toBe(true);
      expect(true || false).toBe(true);
      expect(false || false).toBe(false);
    });

    it('|| 연산자는 논리형 외의 값에도 적용되며, 첫 번째 truthy 값을 반환한다.', () => {
      // @ts-ignore
      expect(2 || 0).toBe(2);
      // @ts-ignore
      expect('not empty' || '').toBe('not empty');
    });

    it('|| 연산자는 모두 falsy일 경우 마지막 값을 반환한다.', () => {
      // @ts-ignore
      expect('' || 0).toBe(0);
      // @ts-ignore
      expect(0 || '').toBe('');
    });
  });

  describe('AND', () => {
    it('&& 연산자는 모두 true일 때만 true를 반환한다.', () => {
      expect(true && true).toBe(true);
      expect(true && false).toBe(false);
      expect(false && false).toBe(false);
    });

    it('&& 연산자는 논리형 외의 값에도 적용되며, 첫 번째 falsy 값을 반환한다.', () => {
      // @ts-ignore
      expect(2 && 0).toBe(0);
      // @ts-ignore
      expect('not empty' && '').toBe('');
    });

    it('&& 연산자는 모두 truthy일 경우 마지막 값을 반환한다.', () => {
      expect(1 && 2).toBe(2);
      // @ts-ignore
      expect('abc' && 'def').toBe('def');
    });
  });

  describe('NOT', () => {
    it('! 연산자는 피연산자를 논리형으로 변환한 후 반대 값을 반환한다.', () => {
      expect(!1).toBe(false);
      expect(!0).toBe(true);
      // @ts-ignore
      expect(!'not empty').toBe(false);
      // @ts-ignore
      expect(!'').toBe(true);
    });

    it('!! 연산자는 피연산자를 논리형으로 변환하는 데 사용된다.', () => {
      expect(!!1).toBe(true);
      expect(!!0).toBe(false);
      // @ts-ignore
      expect(!!'not empty').toBe(true);
      // @ts-ignore
      expect(!!'').toBe(false);
    });
  });

  describe('nullish operator', () => {
    it('?? 연산자는 null과 undefined가 아닌 첫 번째 값을 반환한다.', () => {
      let undefinedLet;

      // @ts-ignore
      expect(0 ?? 2).toBe(0);
      // @ts-ignore
      expect(null ?? 'defined value').toBe('defined value');
      expect(undefinedLet ?? 'defined value').toBe('defined value');
    });

    it('?? 연산자는 모두 null이나 undefined인 경우 마지막 값을 반환한다.', () => {
      // @ts-ignore
      expect(null ?? undefined).toBe(undefined);
      // @ts-ignore
      expect(undefined ?? null).toBe(null);
    });
  });
});
