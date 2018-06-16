import { IFacegramMessage } from '../models'
import { Subject } from 'rxjs'

export interface FacegramService {
  isEnabled: boolean
  name: string
  messageSubject: Subject<IFacegramMessage>

  initialize ()
}
