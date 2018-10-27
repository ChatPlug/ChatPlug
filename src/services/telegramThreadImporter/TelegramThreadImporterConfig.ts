import { IChatPlugServiceConfig } from '../../models'
import ConfigWizardField from '../../configWizard/ConfigWizardField'
import { FieldType } from '../../configWizard/IFieldOptions'

export default class TelegramConfig implements IChatPlugServiceConfig {
  enabled: boolean
  @ConfigWizardField({
    type: FieldType.STRING,
    required: true,
    hint: 'Telegram client ApiId',
  })
  apiId: string

  @ConfigWizardField({
    type: FieldType.STRING,
    required: true,
    hint: 'Telegram client ApiHash',
  })
  apiHash: string

  @ConfigWizardField({
    type: FieldType.STRING,
    required: true,
    hint: 'Phone number of your telegram account',
  })
  phoneNumber: string
}
