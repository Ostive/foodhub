import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class KeyServiceService {
  private readonly logger = new Logger(KeyServiceService.name);

  private apis: Record<string, string> = {
    APIADMIN_LIST_ROUTES: this.generateKey(),
    APIAUTH_LOGIN: this.generateKey(),
    APIAUTH_LOGOUT: this.generateKey(),
    APIAUTH_REGISTER: this.generateKey(),
    APICUSTOMER_PROFILE: this.generateKey(),
    APIDELIVERY: this.generateKey(),
    APIORDER: this.generateKey(),
    APIORDER_ID: this.generateKey(),
    APIORDER_ID_VERIFY_CODE: this.generateKey(),
    APIRESTAURANT: this.generateKey(),
    APIRESTAURANT_DISHES: this.generateKey(),
    APIRESTAURANT_ID: this.generateKey(),
  };

  constructor() {
    setInterval(() => {
      for (const api in this.apis) {
        this.apis[api] = this.generateKey();
      }
      this.logger.log('Toutes les clés ont été régénérées automatiquement');
    }, 3600000);
  }

  private generateKey(): string {
    return 'FH-' + crypto.randomBytes(6).toString('hex');
  }

  getAllKeys(): Record<string, string> {
    return this.apis;
  }

  regenerateKey(apiName: string): string {
    if (!this.apis[apiName]) {
      throw new Error('API inconnue');
    }
    this.apis[apiName] = this.generateKey();
    return this.apis[apiName];
  }
}
