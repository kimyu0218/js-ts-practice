describe('proxy', () => {
  it('get 트랩을 이용해 존재하지 않는 프로퍼티에 접근할 때 기본갑을 반환하도록 제어할 수 있다.', () => {
    const numbers = [0, 1, 2];
    const proxy = new Proxy(numbers, {
      get(target, property) {
        if (property in target) {
          // @ts-ignore
          return target[property];
        } else {
          return 0;
        }
      },
    });

    expect(numbers[123]).toBeUndefined();
    expect(proxy[123]).toBe(0);
  });

  it('set 트랩을 이용해 값의 유효성을 검증하거나 특정 조건을 만족하는 값만 설정할 수 있도록 제한할 수 있다.', () => {
    const numbers = [0, 1, 2];
    const proxy = new Proxy(numbers, {
      set(target, property, value) {
        if (typeof value === 'number') {
          // @ts-ignore
          target[property] = value;
          return true;
        } else {
          return false;
        }
      },
    });

    expect(() => proxy.push(3)).not.toThrow();
    // @ts-ignore
    expect(() => proxy.push('foo')).toThrow();
  });

  it('ownKeys 트랩을 이용해 Object.keys(), Object.values()로 조회되는 목록을 필터링할 수 있다.', () => {
    const foo = {
      name: 'foo',
      age: 20,
      _password: 'bar',
    };
    const proxy = new Proxy(foo, {
      ownKeys(target) {
        return Object.keys(target).filter((key) => !key.startsWith('_'));
      },
    });

    expect(Object.keys(foo).find((key) => key === '_password')).toBeDefined();
    expect(Object.keys(proxy).find((key) => key === '_password')).toBeUndefined();
    expect(Object.values(foo).find((val) => val === 'bar')).toBeDefined();
    expect(Object.values(proxy).find((val) => val === 'bar')).toBeUndefined();
  });

  it('has 트랩을 이용해 in 연산자 사용 시 조건에 따라 존재 여부를 동적으로 판단할 수 있다.', () => {
    const range = { start: 1, end: 10 };
    const proxy = new Proxy(range, {
      has(target, property) {
        // @ts-ignore
        return property >= target.start && property <= target.end;
      },
    });

    expect(5 in range).toBe(false);
    expect(5 in proxy).toBe(true);
  });
});
