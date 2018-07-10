import ConfigWizardField from './configWizard/ConfigWizardField'
import { FieldType } from './configWizard/IFieldOptions'

export default class ChatPlugConfigSkeleton {
  @ConfigWizardField({
    type: FieldType.STRING,
  })
  testField: string

  @ConfigWizardField({
    type: FieldType.STRING,
    defaultValue: 'I AM THE DEFAULT VALUE',
  })
  testFieldWithDefaultValue: string

  @ConfigWizardField({
    type: FieldType.STRING,
    name: 'My CuStOm NAME',
  })
  testFieldWithCustomName: string
}
