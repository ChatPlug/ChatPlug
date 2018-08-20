const apiCodes = {
  1: 'Invalid API key',
  2: 'Too many requests',
  3: 'Connection not found',
}

export default class ApiError {
  code: number
  message: string

  constructor (code: number) {
    this.code = code
    this.message = apiCodes[code]
  }
}
