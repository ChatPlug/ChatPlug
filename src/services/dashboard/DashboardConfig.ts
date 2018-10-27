import ConfigWizardField from '../../configWizard/ConfigWizardField'
import { FieldType } from '../../configWizard/IFieldOptions'

export default class DashboardConfig {
  @ConfigWizardField({
    type: FieldType.BOOLEAN,
    defaultValue: true,
    hint: 'If set to true the API port is also used to host the dashboard',
  })
  bindToAPIServer: boolean

  @ConfigWizardField({
    type: FieldType.NUMBER,
    defaultValue: 2138,
    hint:
      'Port on which the dashboard will listen (no effect when bindToAPIServer is enabled).',
  })
  port: number
}
