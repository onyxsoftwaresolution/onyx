import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService {
  constructor() { }

  #client: PrismaClient;

  get client() {
    if (this.#client != null) return this.#client;
    this.#client = new PrismaClient();
    return this.#client;
  }

  async enableShutdownHooks(app: INestApplication) {
    this.#client?.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
