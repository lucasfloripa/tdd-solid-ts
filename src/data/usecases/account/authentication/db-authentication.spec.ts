import { mockEncrypter, mockHashComparer, mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '@/data/test'
import { mockAccountModel, mockFakeAuthentication } from '@/domain/test'
import { DbAuthentication } from './db-authentication'
import { HashComparer, Encrypter, LoadAccountByEmailRepository, UpdateAccessTokenRepository } from './db-authentication-protocols'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const hashComparerStub = mockHashComparer()
  const tokenGeneratorStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const fakeAuthenticationModel = mockFakeAuthentication()
    await sut.auth(fakeAuthenticationModel)
    expect(loadSpy).toHaveBeenCalledWith(fakeAuthenticationModel.email)
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    const fakeAuthenticationModel = mockFakeAuthentication()
    await sut.auth(fakeAuthenticationModel)
    expect(compareSpy).toHaveBeenCalledWith(fakeAuthenticationModel.password, 'any_password')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const compareSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    const fakeAuthenticationModel = mockFakeAuthentication()
    await sut.auth(fakeAuthenticationModel)
    expect(compareSpy).toHaveBeenCalledWith(mockAccountModel().id, 'any_token')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const fakeAuthenticationModel = mockFakeAuthentication()
    const promise = sut.auth(fakeAuthenticationModel)
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const fakeAuthenticationModel = mockFakeAuthentication()
    const promise = sut.auth(fakeAuthenticationModel)
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const fakeAuthenticationModel = mockFakeAuthentication()
    const promise = sut.auth(fakeAuthenticationModel)
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const fakeAuthenticationModel = mockFakeAuthentication()
    const promise = sut.auth(fakeAuthenticationModel)
    await expect(promise).rejects.toThrow()
  })

  test('Should returns null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
    const fakeAuthenticationModel = mockFakeAuthentication()
    const accessToken = await sut.auth(fakeAuthenticationModel)
    expect(accessToken).toBeNull()
  })

  test('Should returns null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const fakeAuthenticationModel = mockFakeAuthentication()
    const accessToken = await sut.auth(fakeAuthenticationModel)
    expect(accessToken).toBeNull()
  })

  test('Should return a token on succcess', async () => {
    const { sut } = makeSut()
    const fakeAuthenticationModel = mockFakeAuthentication()
    const accessToken = await sut.auth(fakeAuthenticationModel)
    expect(accessToken).toBe('any_token')
  })
})
