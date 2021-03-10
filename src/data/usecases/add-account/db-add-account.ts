import { Encrypter } from '../authentication/db-authentication-protocols'
import { AccountModel, AddAccount, AddAccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
  ) { }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassord = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassord })
    return account
  }
}
