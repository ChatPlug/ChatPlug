import log from 'npmlog'
import crypto from 'crypto'
import { createInterface } from 'readline'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

function askForNumber(callback) {
  rl.question('Enter authorization code sent to your telegram account: ', x => {
    rl.close()
    callback(x)
  })
}

export const telegramApiConfig = {
  invokeWithLayer: 0xda9b0d0d,
  layer: 57,
  initConnection: 0x69796de9,
  api_id: 49631,
  app_version: '1.0.1',
  lang_code: 'en',
}

export const telegramMtProtoServer = { dev: false }

export async function telegramClientLogin(telegram:any, apiId, apiHash, phoneNumber) {
  log.info(
    'telegram',
    'Sending authorization code to telegram user',
    this.config.telegramUsername,
  )
  const { phone_code_hash } = (await this.telegram('auth.sendCode', {
    phone_number: phoneNumber,
    api_id: apiId,
    api_hash: apiHash,
  })) as any

  const code = await new Promise(result =>
    rl.question(
      'Enter authorization code sent to your telegram account: ',
      result,
    ),
  )

  let result
  try {
    result = (await this.telegram('auth.signIn', {
      phone_code_hash,
      phone_number: this.config.phoneNumber,
      phone_code: code,
    })) as any
  } catch (error) {
    if (error.type !== 'SESSION_PASSWORD_NEEDED') throw error

    const password = await new Promise(result =>
      rl.question('Enter your telegram account\'s password: ', result),
    )

    const { current_salt } = (await this.telegram(
      'account.getPassword',
      {},
    )) as any
    const passwordHash = crypto
      .createHash('sha256')
      .update(Buffer.concat([
        Buffer.from(current_salt),
        Buffer.from(password as string, 'utf8'),
        Buffer.from(current_salt),
      ]) as any)
      .digest()
    result = await this.telegram('auth.checkPassword', {
      passwordHash,
    })
  }
  log.info('telegram', 'Logged in as', result.user.first_name)
}
