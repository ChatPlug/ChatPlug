import { IFacegramService, IFacegramMessage } from './models'
import { Subject } from 'rxjs'
import { FacebookConfig } from './facebookconfig';
import facebook from 'facebook-chat-api'
import { createInterface } from 'readline'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

export class FacebookService implements IFacegramService {
  name = 'facebook'
  messageSubject = Subject.create()
  receiveMessageSubject: Subject<IFacegramMessage>
  config: FacebookConfig
  facebook: any

  constructor (config: FacebookConfig, receiveSubject: Subject<IFacegramMessage>) {
    this.receiveMessageSubject = receiveSubject
    this.config = config  
  }

  initialize () {
    return new Promise((resolve, reject) => {
      facebook({
        email: this.config.login,
        password: this.config.password
      }, {
        forceLogin: this.config.forceLogin
      }, async (err, api) => {
        if (err) {
          if (err.error !== 'login-approval') return reject(err)
          console.log('Login approval pending...')
          let code = await new Promise(result => rl.question('Enter login approval code to your Facebook account (SMS or Google Authenticator app): ', result))
          err.continue(code)
        }
        this.facebook = api
        resolve()
      })
    })
  }
}