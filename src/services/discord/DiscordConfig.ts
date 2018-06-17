import { IFacegramServiceConfig } from '../../models';

export interface DiscordConfig extends IFacegramServiceConfig {
  token: string;
}
