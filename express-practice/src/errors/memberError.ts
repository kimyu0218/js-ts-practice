export class MemberNotFoundError extends Error {
  constructor(id: number) {
    super(`Member not found: id=${id}`);
    this.status = 404;
  }
}
