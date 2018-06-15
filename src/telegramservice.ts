import { IFacegramService, IFacegramMessage } from './models';
import { Subject } from 'rxjs';

class TelegramService implements IFacegramService {
    name = "telegram"
    messageSubject = Subject.create()

    constructor() {

    }
}