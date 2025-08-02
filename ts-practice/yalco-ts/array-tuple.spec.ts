describe('array & tuple', () => {
  it('readonly 배열의 원본은 수정할 수 없지만, 복사본은 수정할 수 있다.', () => {
    const arr: readonly number[] = [1, 2, 3];
    const copiedArr = [...arr];

    // arr[0] = 4; // Error
    // arr.push(4); // Error
    expect(() => (copiedArr[0] = 4)).not.toThrow();
  });

  it('튜플은 고정된 순서를 가지며 구조 분해 할당이 가능하다.', () => {
    let person: [string, number] = ['foo', 20];

    // person = [20, 'foo']; // Error
    expect(() => (person = ['bar', 30])).not.toThrow();
    expect(() => {
      let name: string;
      let age: number;
      [name, age] = person;
    }).not.toThrow();
  });

  it('as const로 선언된 튜플은 readonly가 되어 요소를 수정할 수 없다.', () => {
    const nonConstTuple = ['foo', 20];
    const constTuple = ['foo', 20] as const;

    expect(() => (nonConstTuple[0] = 'bar')).not.toThrow();
    // constTuple[0] = 'foo'; // Error
    // constTuple[0] = 'bar'; // Error
  });
});
