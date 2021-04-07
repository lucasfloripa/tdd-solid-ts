import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols'
import { AccountModel, AddAccount, AddAccountParams, Hasher, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) { }

  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const { password, email } = accountData
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (!account) {
      const hashedPassord = await this.hasher.hash(password)
      const newAccount = await this.addAccountRepository.add({ ...accountData, password: hashedPassord })
      return newAccount
    }
    return null
  }
}
