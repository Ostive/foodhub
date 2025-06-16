import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { getConfig } from 'libs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersMicroserviceClient {
  private client: ClientProxy;

  constructor() {
    const config = getConfig();
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost', // In production, this would be the service name in a container environment
        port: config.services.userMicroservicePort,
      },
    });
  }

  async findByEmail(email: string): Promise<any> {
    return firstValueFrom(this.client.send({ cmd: 'findUserByEmail' }, email));
  }

  async findById(id: number): Promise<any> {
    return firstValueFrom(this.client.send({ cmd: 'findUserById' }, id));
  }

  async validateUser(email: string, password: string): Promise<any> {
    return firstValueFrom(
      this.client.send({ cmd: 'validateUser' }, { email, password })
    );
  }
}
