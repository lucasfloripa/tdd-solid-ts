export type HttpRequest = {
  headers?: any
  body?: any
  params?: any
  accountId?: string
}

export type HttpResponse = {
  statusCode: number
  body: any
}
