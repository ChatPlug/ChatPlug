import npmlog from 'npmlog';
import { IFacegramMessage } from '../../models';
import { FacegramService } from '../Service';
import { Subject } from 'rxjs';
import { DiscordConfig } from './DiscordConfig';
import { Client as DiscordClient, TextChannel, Collection, Webhook } from 'discord.js';
import { ExchangeManager } from '../../ExchangeManager';

export class DiscordService implements FacegramService {
  isEnabled: boolean;
  name = 'discord';
  exchangeManager: ExchangeManager;
  receiveMessageSubject: Subject<IFacegramMessage> = new Subject();
  config: DiscordConfig;
  discord = new DiscordClient();
  webhooks: Collection<string, Webhook>;

  constructor (config: DiscordConfig, exchangeManager: ExchangeManager) {
    this.exchangeManager = exchangeManager;
    this.config = config;
    this.isEnabled = config.enabled;
  }

  async initialize () {
    this.receiveMessageSubject.subscribe(async (message) => {
      if (!message.target) return;

      const channel = this.discord.channels.get(message.target.id);
      if (!channel || channel.type !== 'text') return log.warn('discord', `Channel ${message.target} not found!`);

      let webhook = this.webhooks.find('channelID', message.target.id);
      if (!webhook) {
        webhook = await (channel as TextChannel).createWebhook(
          `Facegram ${(channel as TextChannel).name}`.substr(0, 32),
          'https://github.com/feelfreelinux/facegram/raw/master/facegram_logo.png',
        );
        this.webhooks.set(webhook.id, webhook);
      }
      webhook.send(message.message, {
        username: message.author.username,
        avatarURL: message.author.avatar,
        files: message.attachments.map(file => ({ attachment: file.url, name: file.name })),
      }).then().catch(err => log.error('discord', err));
    });

    this.discord.on('message', (message) => {
      if (this.webhooks.has(message.author.id) || message.author.username === this.discord.user.username) return;
      const facegramMessage = {
        message: message.content,
        attachments: message.attachments.map(file => ({ name: file.filename, url: file.url })),
        author: {
          username: message.author.username,
          avatar: message.author.avatarURL,
          id: message.author.id,
        },
        origin: {
          id: message.channel.id,
          service: this.name,
        },
      } as IFacegramMessage;

      this.exchangeManager.messageSubject.next(facegramMessage);
    });
    return this.discord.login(this.config.token).then(async () => {
      // get array of collections of webhooks from all guilds
      Promise.all(this.discord.guilds.map(guild => guild.fetchWebhooks())).then((allWebhooks) => {
        // filter them to get only Facegram's webhooks
        const filteredWebhooks = allWebhooks.map(webhooks => webhooks.filter(webhook => webhook.name.startsWith('Facegram')));
        // save them to a new collection
        this.webhooks = new Collection();
        this.webhooks = this.webhooks.concat(...filteredWebhooks);
        log.silly('discord: webhooks', '%o', this.webhooks);
      }).catch(err => log.error('discord', err));
      log.info('discord', 'Logged in as', this.discord.user.username);
    }).catch(err => log.error('discord', err));
  }

  terminate () {
    return this.discord.destroy();
  }
}
