import { BcrypterAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  },
  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

const salt = 12
const makeSut = (): BcrypterAdapter => {
  return new BcrypterAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a valid hash on hash success', async () => {
      const sut = makeSut()
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hash')
    })

    test('Should throw if hash throws (integration test)', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
      const promise: Promise<string> = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    test('Should call compare with correct values', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_value', 'any_hash')
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('Should return true on compare success', async () => {
      const sut = makeSut()
      const hash = await sut.compare('any_value', 'hash')
      expect(hash).toBe(true)
    })

    test('Should return false on compare fails', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
      const hash = await sut.compare('any_value', 'hash')
      expect(hash).toBe(false)
    })

    test('Should throw if compare throws (integration test)', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
      const promise: Promise<boolean> = sut.compare('any_value', 'hash')
      await expect(promise).rejects.toThrow()
    })
  })
})
