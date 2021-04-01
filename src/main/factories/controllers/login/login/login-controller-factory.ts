import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { LoginController } from '@/presentation/controllers/login/login/login-controller'
import { Controller } from '@/presentation/protocols'
import { makeDbAuthentication } from '../../../usecases/account/authentication/db-authentication-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeLoginValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
