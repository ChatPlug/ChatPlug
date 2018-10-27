import { IChatPlugServiceConfig } from '../../models'
import ConfigWizardField from '../../configWizard/ConfigWizardField'
import { FieldType } from '../../configWizard/IFieldOptions'

export default class DiscordConfig implements IChatPlugServiceConfig {
  enabled: boolean
  @ConfigWizardField({
    type: FieldType.STRING,
    required: true,
    hint: 'Access token of your discord bot.',
  })
  token: string
}
