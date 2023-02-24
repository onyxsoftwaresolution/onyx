import * as bcrypt from 'bcrypt';

export class Security {
  static async createPasswordHash(password: string, saltOrRounds = 8) {
    return await bcrypt.hash(password, saltOrRounds);
  }

  static async comparePasswordHash(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
