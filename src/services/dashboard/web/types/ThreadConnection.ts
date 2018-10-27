import ServiceThread from './ServiceThread'
import Message from "./Message";
interface ThreadConnection  {
  id: number,
  connectionName: string
  createdAt: Date,
  threads: ServiceThread[],
  messages: Message[]
}

export default ThreadConnection
 