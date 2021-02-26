import { DbAuthentication } from './db-authentication'
import { AuthenticationModel, HashComparer, TokenGenerator, LoadAccountByEmailRepository, UpdateAccessTokenRepository, AccountModel } from './db-authentication-protocols'

const makeFakeAuthenticationModel = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'hashed_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return makeFakeAccount()
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

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new TokenGeneratorStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (id: string, token: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
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
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    const fakeAuthenticationModel = makeFakeAuthenticationModel()
    await sut.auth(fakeAuthenticationModel)
    expect(loadSpy).toHaveBeenCalledWith(fakeAuthenticationModel.email)
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    const fakeAuthenticationModel = makeFakeAuthenticationModel()
    await sut.auth(fakeAuthenticationModel)
    expect(compareSpy).toHaveBeenCalledWith(fakeAuthenticationModel.password, 'hashed_password')
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut } = makeSut()
    const fakeAuthenticationModel = makeFakeAuthenticationModel()
    const accessToken = await sut.auth(fakeAuthenticationModel)
    expect(accessToken).toBe('any_token')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const compareSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    const fakeAuthenticationModel = makeFakeAuthenticationModel()
    await sut.auth(fakeAuthenticationModel)
    expect(compareSpy).toHaveBeenCalledWith(makeFakeAccount().id, 'any_token')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const fakeAuthenticationModel = makeFakeAuthenticationModel()
    const promise = sut.auth(fakeAuthenticationModel)
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const fakeAuthenticationModel = makeFakeAuthenticationModel()
    const promise = sut.auth(fakeAuthenticationModel)
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const fakeAuthenticationModel = makeFakeAuthenticationModel()
    const promise = sut.auth(fakeAuthenticationModel)
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const fakeAuthenticationModel = makeFakeAuthenticationModel()
    const promise = sut.auth(fakeAuthenticationModel)
    await expect(promise).rejects.toThrow()
  })

  test('Should returns null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)
    const fakeAuthenticationModel = makeFakeAuthenticationModel()
    const accessToken = await sut.auth(fakeAuthenticationModel)
    expect(accessToken).toBeNull()
  })

  test('Should returns null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const fakeAuthenticationModel = makeFakeAuthenticationModel()
    const accessToken = await sut.auth(fakeAuthenticationModel)
    expect(accessToken).toBeNull()
  })
})
