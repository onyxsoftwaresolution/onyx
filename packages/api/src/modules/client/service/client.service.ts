import { Injectable } from '@nestjs/common';
import {
  CreateClientDTO,
  UpdateClientDTO,
  UpsertClientDTO,
} from '../dtos/client.in.dto';
import { ClientOutDTO } from '../dtos/client.out.dto';
import { ClientProvider } from '../provider/client.provider';

@Injectable()
export class ClientService {
  constructor(private clientProvider: ClientProvider) { }

  async createClient(data: CreateClientDTO) {
    return new ClientOutDTO(await this.clientProvider.createClient(data));
  }

  async listClients() {
    const clients = await this.clientProvider.listClients();
    return clients.map((e) => new ClientOutDTO(e));
  }

  async updateClient(data: UpdateClientDTO) {
    return new ClientOutDTO(await this.clientProvider.updateClient(data));
  }

  async upsertClient(data: UpsertClientDTO) {
    return new ClientOutDTO(await this.clientProvider.upsertClient(data));
  }

  async deleteClient(id: number) {
    return new ClientOutDTO(await this.clientProvider.deleteClient(id));
  }
}
