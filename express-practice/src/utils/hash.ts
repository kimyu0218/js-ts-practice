import * as bcrypt from 'bcrypt';

const saltRounds = 10;

export function bcryptHash(data: string) {
  return bcrypt.hashSync(data, saltRounds);
}

export async function bcryptCompare(data: string, encrypted: string) {
  return bcrypt.compare(data, encrypted);
}
