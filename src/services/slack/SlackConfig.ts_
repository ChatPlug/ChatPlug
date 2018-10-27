import { IChatPlugServiceConfig } from '../../models'
import ConfigWizardField from '../../configWizard/ConfigWizardField'
import { FieldType } from '../../configWizard/IFieldOptions'

export default class SlackConfig implements IChatPlugServiceConfig {
  enabled: boolean
  @ConfigWizardField({
    type: FieldType.STRING,
    required: true,
    hint: 'Slack bot token from api.slack.com',
  })
  botToken: string
  conversationID: number
}
