import Message from './Message'


export default interface Attachment {
  id: number
  url: string
  name: string
  message: Message
}
