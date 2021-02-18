import { Encrypter } from '../../data/protocols/encrypter'
import { BcrypterAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

const salt = 12
const makeSut = (): Encrypter => {
  return new BcrypterAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
