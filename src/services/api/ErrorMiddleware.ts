import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers'
import ApiError from './ApiError'
import { createErrorResponse } from './ApiResponse'

@Middleware({ type: 'after' })
export default class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: (err: any) => any) {
    if (error instanceof HttpError) {
      if (response.headersSent) {
        return next(error)
      }
      response.set('Content-Type', 'application/json')
      response.status(error.httpCode)
      response.json(createErrorResponse(error))
    } else {
      next(error)
    }
  }
}
