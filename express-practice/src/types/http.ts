type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type TenDigit = Exclude<Digit, 6 | 7 | 8 | 9>;
type HundredDigit = Exclude<Digit, 6 | 7 | 8 | 9 | 0>;
type StatusCode = `${HundredDigit}${TenDigit}${Digit}`;

export type HttpStatusCode = StatusCode extends `${infer T extends number}` ? T : never;
