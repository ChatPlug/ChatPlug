import { Interceptor, ExpressErrorMiddlewareInterface, HttpError, InterceptorInterface, Action } from 'routing-controllers'
import ApiError from './ApiError'
import { createErrorResponse } from './ApiResponse'

@Interceptor()
export default class ResponseMiddleware implements InterceptorInterface {
  intercept(_: Action, res: any): any {
    console.log(res)
    if (res) {
      return ({ data: res })
    }
    return res
  }
}
