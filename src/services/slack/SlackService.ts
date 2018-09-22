import log from 'npmlog'
import { IChatPlugMessage, IChatPlugAttachement } from '../../models'
import { ChatPlugService } from '../Service'
import { Subject } from 'rxjs'
import SlackConfig from './SlackConfig'
import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'
import { SlackMessageHandler } from './SlackMessageHandler'
import { ChatPlugConfig } from '../../ChatPlugConfig'
import Message from '../../entity/Message'
const { RTMClient } = require('@slack/client')
// import { ContextMessageUpdate } from 'slack...'

export default class SlackService extends ChatPlugService<SlackConfig> {
  messageHandler: SlackMessageHandler
  config: SlackConfig
  rtm: any
  token: any

  async initialize() {
    this.token = process.env.SLACK_TOKEN
    this.rtm = new RTMClient(this.token)

    this.rtm.start()

    const conversationId = '' // Conversation ID

    this.messageHandler = new SlackMessageHandler(this.rtm, this.context.exchangeManager.messageSubject, this.context)

    if (!this.token) {
      console.log('You must specify a token...')
      return
    }

    const rtm = new RTMClient(this.token)

    rtm.start()
    rtm.sendMessage(this.messageHandler, conversationId)
    .then((res) => {
      console.log('Message sent: ', res.ts)
    })
    .catch(console.error)

    rtm.on('message', this.messageHandler.onOutgoingMessage)

    rtm.on('ready', (event) => {
      console.log('Slack service is working!')
    })

    log.info('Slack', 'Registered bot handlers')
  }

  private newMethod() {
    return this
  }

  async terminate() {
    await this.rtm.stop()
  }
}
