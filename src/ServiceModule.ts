import { Exclude } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

/**
 * Represents a module from which a service instance can be created.
 */
export default class ServiceModule {
  /**
   * Set to true if there is a problem with this service module.
   */
  @Exclude({ toClassOnly: true })
  valid: boolean

  /**
   * A message explaining why this service module is invalid.
   */
  @Exclude({ toClassOnly: true })
  error: string

   /**
   * Name of the module used in the database
   */
  @Exclude({ toClassOnly: true })
  moduleName: string

  /**
   * The base directory of the module.
   */
  @Exclude({ toClassOnly: true })
  modulePath: string

  @IsNotEmpty()
  displayName: string

  @IsNotEmpty()
  version: string

  @IsNotEmpty()
  description: string

  /**
   * If set to true the service will be automatically enabled and not shown in the GUI by default.
   */
  systemService: boolean
}
