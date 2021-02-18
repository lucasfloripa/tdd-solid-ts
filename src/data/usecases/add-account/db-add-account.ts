import { AccountModel, Encrypter, AddAccount, AddAccountModel } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter
  ) { }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const { password, name, email } = account
    await this.encrypter.encrypt(account.password)
    return {
      id: '',
      email,
      name,
      password
    }
  }
}
