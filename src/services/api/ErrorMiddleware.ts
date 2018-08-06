import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers'
import ApiError from './ApiError'
import { createErrorResponse } from './ApiResponse'

@Middleware({ type: 'after' })
export default class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: (err: any) => any) {
    console.log(request)
    next(JSON.stringify(createErrorResponse(error)))
  }
}
