import { Encrypter } from '../../data/protocols/encrypter'
import { BcrypterAdapter } from './bcrypt-adapter'

const makeSut = (): Encrypter => {
  return new BcrypterAdapter()
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct value', () => {
    const sut = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })
})
