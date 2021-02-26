import { Authentication, AuthenticationModel, HashComparer, TokenGenerator, LoadAccountByEmailRepository, UpdateAccessTokenRepository } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateTokenAccessRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const { email, password } = authentication
    const account = await this.loadAccountByEmailRepository.load(email)
    if (account) {
      const isComparerValid = await this.hashComparer.compare(password, account.password)
      if (isComparerValid) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        await this.updateTokenAccessRepository.update(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
