describe('type', () => {
  it('교차 타입으로 여러 타입을 결합할 수 있다.', () => {
    type HttpResponseHeader = {
      statusCode: number;
      statusMessage: string;
    };
    type HttpResponseBody = { data: any };
    type HttpResponse = HttpResponseHeader & HttpResponseBody;

    expect(() => {
      const res: HttpResponse = {
        statusCode: 200,
        statusMessage: 'OK',
        data: { isLogin: true },
      };
    }).not.toThrow();
  });

  it('리터럴 타입으로 제한된 값만 허용할 수 있다.', () => {
    function setTheme(theme: 'light' | 'dark' | 'system'): void {}
    const constVar = 'light';
    let letVar = 'dark';

    expect(() => setTheme(constVar)).not.toThrow();
    // setTheme(letVar); // Error
  });

  it('템플릿 리터럴 타입으로 특정 형식의 문자열 타입을 만들 수 있다.', () => {
    type Lang = 'kr' | 'en' | 'jp';
    type Locale = `locale-${Lang}`;

    expect(() => {
      const locale: Locale = 'locale-kr';
    }).not.toThrow();
    // const locale: Locale = 'locale-fr'; // Error
  });

  it('사용자 정의 타입 가드로 유니온 타입에서 특정 타입을 판별할 수 있다.', () => {
    type Fish = { swim: () => void };
    type Bird = { fly: () => void };
    function isFish(pet: Fish | Bird): pet is Fish {
      return (pet as Fish).swim !== undefined;
    }
    const fish: Fish = { swim() {} };
    const bird: Bird = { fly() {} };

    expect(isFish(fish)).toBe(true);
    expect(isFish(bird)).toBe(false);
  });
});
