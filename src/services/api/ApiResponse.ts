export const createDataResponse = (response: any): any => {
  return { data: response }
}

export const createErrorResponse = (exception: any): any => {
  return { error: exception }
}
