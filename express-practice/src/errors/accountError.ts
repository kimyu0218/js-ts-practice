export class AccountNotFoundError extends Error {
  constructor(id: number) {
    super(`Account not found: id=${id}`);
    this.status = 404;
  }
}

export class PasswordMismatchError extends Error {
  constructor() {
    super('Failed to login: Password does not match');
    this.status = 401;
  }
}
