import { Injectable } from '@nestjs/common';
import {
  UpsertClientDTO,
} from '../dtos/client.in.dto';
import { ClientOutDTO } from '../dtos/client.out.dto';
import { ClientProvider } from '../provider/client.provider';

@Injectable()
export class ClientService {
  constructor(private clientProvider: ClientProvider) { }

  async listClients() {
    const clients = await this.clientProvider.listClients();
    return clients.map((e) => new ClientOutDTO(e));
  }

  async getClient(id: number): Promise<ClientOutDTO> {
    return new ClientOutDTO(await this.clientProvider.getClient(id));
  }

  async upsertClient(data: UpsertClientDTO) {
    return new ClientOutDTO(await this.clientProvider.upsertClient(data));
  }

  async deleteClient(id: number) {
    return new ClientOutDTO(await this.clientProvider.deleteClient(id));
  }
}
