import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols'
import { AccountModel, AddAccount, AddAccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) { }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const { password, email } = accountData
    await this.loadAccountByEmailRepository.loadByEmail(email)
    const hashedPassord = await this.hasher.hash(password)
    const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassord })
    return account
  }
}
