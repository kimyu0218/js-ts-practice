describe('enum', () => {
  it('값을 명시하지 않은 숫자 enum은 0부터 순차적으로 정수값이 할당되며, 숫자와 문자열 간의 양방향 매핑이 가능하다.', () => {
    enum Direction {
      Up,
      Down,
      Left,
      Right,
    }

    expect(Direction.Up).toBe(0);
    expect(Direction.Down).toBe(1);
    expect(Direction[2]).toBe('Left');
    expect(Direction[3]).toBe('Right');
  });

  it('값을 명시하지 않은 숫자 enum 요소는 이전 값을 기준으로 1보다 큰 값이 할당된다.', () => {
    enum Priority {
      Low = -1,
      Medium,
      High = 3,
      Critical,
    }

    expect(Priority.Medium).toBe(0);
    expect(Priority.Critical).toBe(4);
  });

  it('문자열 enum은 요소에 반드시 값을 명시해야 하며, 타입이 제한되기 때문에 안전한 값만 인자로 사용할 수 있다.', () => {
    enum Theme {
      Light = 'light-theme',
      Dark = 'dark-theme',
      System = 'system-theme',
      //   Dummy, // Error
    }
    function applyTheme(theme: Theme): void {
      console.log(`Theme applied: ${theme}`);
    }

    expect(Theme.Light).toBe('light-theme');
    expect(() => applyTheme(Theme.Dark)).not.toThrow();
    // applyTheme('dark-theme'); // Error
  });

  it('enum을 함수 인자로 활용하면 값의 범위가 제한되어 안정성이 높아진다.', () => {
    enum UserRole {
      Admin = 0,
      Manager = 1,
      Employee = 2,
      Guest = 3,
    }
    function checkAuthority(userRole: UserRole): boolean {
      if (userRole === UserRole.Admin || userRole === UserRole.Manager) {
        return true;
      }
      return false;
    }

    expect(checkAuthority(UserRole.Admin)).toBe(true);
    expect(checkAuthority(UserRole.Employee)).toBe(false);
    expect(checkAuthority(3)).toBe(false);
    // checkAuthority(99); // Error
  });
});
