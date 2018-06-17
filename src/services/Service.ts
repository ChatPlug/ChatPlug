import { IFacegramMessage } from '../models'
import { Subject } from 'rxjs'

export interface FacegramService {
  isEnabled: boolean
  name: string
  receiveMessageSubject: Subject<IFacegramMessage>

  initialize ()
}
