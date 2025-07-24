describe('closure', () => {
  it('클로저는 외부 함수의 실행 컨텍스트가 끝났더라도 외부 함수의 지역 변수에 접근할 수 있다.', () => {
    function outerFunc() {
      const name = 'foo';

      const innerFunc = function () {
        return name;
      };
      return innerFunc;
    }
    const closure = outerFunc();

    expect(closure()).toBe('foo');
  });
});
