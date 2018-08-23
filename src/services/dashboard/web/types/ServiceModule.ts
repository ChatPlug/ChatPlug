/**
 * See the ServiceInstance class for more info, this is just the frontend version.
 */
interface ServiceModule {
    valid: boolean
    error: string
    moduleName: string
    modulePath: string
    displayName: string
    version: string
    brandColor: string
    description: string
    systemService: boolean
  }
  
  export default ServiceModule;
  