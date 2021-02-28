import { Authentication, AuthenticationModel, HashComparer, Encrypter, LoadAccountByEmailRepository, UpdateAccessTokenRepository } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: Encrypter,
    private readonly updateTokenAccessRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const { email, password } = authentication
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (account) {
      const isComparerValid = await this.hashComparer.compare(password, account.password)
      if (isComparerValid) {
        const accessToken = await this.tokenGenerator.encrypt(account.id)
        await this.updateTokenAccessRepository.updateAccessToken(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
