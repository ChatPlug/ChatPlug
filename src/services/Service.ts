import { IChatPlugMessage } from '../models'
import { Subject } from 'rxjs'

export interface ChatPlugService {
  isEnabled: boolean
  name: string
  receiveMessageSubject: Subject<IChatPlugMessage>

  initialize ()

  terminate ()
}
