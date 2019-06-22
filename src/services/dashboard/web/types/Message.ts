import ServiceUser from './ServiceUser'
import ServiceInstance from './ServiceInstance'
import ThreadConnection from './ThreadConnection'
import Attachment from './Attachment'

export default interface Message {
  id: number
  content: string
  author: ServiceUser
  createdAt: Date
  attachements: Attachment[]
  threadConnection: ThreadConnection
  service: ServiceInstance
  originExternalThreadId: string
}
