import { AccountModel, AddAccount, AddAccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) { }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const { password, name, email } = accountData
    const hashedPassord = await this.encrypter.encrypt(password)
    await this.addAccountRepository.add({ ...accountData, password: hashedPassord })
    return {
      id: '',
      email,
      name,
      password
    }
  }
}
