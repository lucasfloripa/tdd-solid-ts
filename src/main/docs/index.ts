import { loginPath } from '@/main/docs/paths'
import { unauthorizedResponse, badRequestResponse, serverErrorResponse, notFoundResponse } from '@/main/docs/components'
import { accountSchema, loginParamsSchema, errorSchema } from '@/main/docs/schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Elciess SignUp',
    description: 'SignUp and Survey register',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema
  },
  components: {
    badRequestResponse,
    serverErrorResponse,
    unauthorizedResponse,
    notFoundResponse
  }
}
