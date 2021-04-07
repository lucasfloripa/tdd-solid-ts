import { mockAccountModel } from '@/domain/test'
import { DbAuthentication } from './db-authentication'
import { AuthenticationParams, HashComparer, Encrypter, LoadAccountByEmailRepository, UpdateAccessTokenRepository, AccountModel } from './db-authentication-protocols'

const makeFakeAuthentication = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return mockAccountModel()
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new HashComparerStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new EncrypterStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeEncrypter()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
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
    const fakeAuthenticationModel = makeFakeAuthentication()
    await sut.auth(fakeAuthenticationModel)
    expect(loadSpy).toHaveBeenCalledWith(fakeAuthenticationModel.email)
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    const fakeAuthenticationModel = makeFakeAuthentication()
    await sut.auth(fakeAuthenticationModel)
    expect(compareSpy).toHaveBeenCalledWith(fakeAuthenticationModel.password, 'any_password')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const compareSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    const fakeAuthenticationModel = makeFakeAuthentication()
    await sut.auth(fakeAuthenticationModel)
    expect(compareSpy).toHaveBeenCalledWith(mockAccountModel().id, 'any_token')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const fakeAuthenticationModel = makeFakeAuthentication()
    const promise = sut.auth(fakeAuthenticationModel)
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const fakeAuthenticationModel = makeFakeAuthentication()
    const promise = sut.auth(fakeAuthenticationModel)
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const fakeAuthenticationModel = makeFakeAuthentication()
    const promise = sut.auth(fakeAuthenticationModel)
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const fakeAuthenticationModel = makeFakeAuthentication()
    const promise = sut.auth(fakeAuthenticationModel)
    await expect(promise).rejects.toThrow()
  })

  test('Should returns null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
    const fakeAuthenticationModel = makeFakeAuthentication()
    const accessToken = await sut.auth(fakeAuthenticationModel)
    expect(accessToken).toBeNull()
  })

  test('Should returns null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const fakeAuthenticationModel = makeFakeAuthentication()
    const accessToken = await sut.auth(fakeAuthenticationModel)
    expect(accessToken).toBeNull()
  })

  test('Should return a token on succcess', async () => {
    const { sut } = makeSut()
    const fakeAuthenticationModel = makeFakeAuthentication()
    const accessToken = await sut.auth(fakeAuthenticationModel)
    expect(accessToken).toBe('any_token')
  })
})
