import { IFacegramServiceConfig } from '../../models';

export interface TelegramConfig extends IFacegramServiceConfig {
  apiId: string;
  apiHash: string;
  phoneNumber: string;
  telegramUsername: string;
  botToken: string;
}
