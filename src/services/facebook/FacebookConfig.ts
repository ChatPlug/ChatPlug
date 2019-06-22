import { IChatPlugServiceConfig } from '../../models'
import ConfigWizardField from '../../configWizard/ConfigWizardField'
import { FieldType } from '../../configWizard/IFieldOptions'

export default class FacebookConfig implements IChatPlugServiceConfig {
  enabled: boolean
  @ConfigWizardField({
    type: FieldType.STRING,
    required: true,
    hint: 'Email address of your facebook account',
  })
  email: string

  @ConfigWizardField({
    type: FieldType.STRING,
    required: true,
    hint: 'Password of your facebook account',
  })
  password: string
}
