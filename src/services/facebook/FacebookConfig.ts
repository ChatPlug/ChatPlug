import { IFacegramServiceConfig } from '../../models';

export interface FacebookConfig extends IFacegramServiceConfig {
  email: string;
  password: string;
  forceLogin: boolean;
}
