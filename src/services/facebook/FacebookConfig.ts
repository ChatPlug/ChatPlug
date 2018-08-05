import { IChatPlugServiceConfig } from '../../models'
import ConfigWizardField from '../../configWizard/ConfigWizardField'
import { FieldType } from '../../configWizard/IFieldOptions'

export default class FacebookConfig implements IChatPlugServiceConfig {
  enabled: boolean
  @ConfigWizardField({
    type: FieldType.STRING,
    required: true,
    hint: 'Email address of you facebook account',
  })
  email: string

  @ConfigWizardField({
    type: FieldType.STRING,
    required: true,
    hint: 'Password of you facebook account',
  })
  password: string

  @ConfigWizardField({
    type: FieldType.BOOLEAN,
    hint: 'Force logging in to Facebook',
    defaultValue: false,
  })
  forceLogin: boolean
}
