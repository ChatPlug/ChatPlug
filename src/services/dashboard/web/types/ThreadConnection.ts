import ServiceThread from './ServiceThread'

interface ThreadConnection  {
  id: number,
  createdAt: Date,
  threads: ServiceThread[],
}

export default ThreadConnection
