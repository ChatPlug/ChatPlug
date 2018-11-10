import { IChatPlugServiceConfig } from '../../models'
import ConfigWizardField from '../../configWizard/ConfigWizardField'
import { FieldType } from '../../configWizard/IFieldOptions'

export default class TelegramConfig implements IChatPlugServiceConfig {
  enabled: boolean
  @ConfigWizardField({
    type: FieldType.STRING,
    required: true,
    hint: 'Telegram bot token from BotFather',
  })
  botToken: string

  @ConfigWizardField({
    type: FieldType.BOOLEAN,
    defaultValue: false,
    hint: 'Use ChatPlug as telegram client (allows to search, requires appid of your account)',
  })
  useAsClient: boolean

  @ConfigWizardField({
    type: FieldType.NUMBER,
    defaultValue: '',
    hint: 'Api id (Only for client mode)',
  })
  apiId: number

  @ConfigWizardField({
    type: FieldType.STRING,
    defaultValue: '',
    hint: 'Api hash (Only for client mode)',
  })
  apiHash: string

  @ConfigWizardField({
    type: FieldType.STRING,
    defaultValue: '',
    hint: 'Phone number (Only for client mode)',
  })
  phoneNumber: string
}
