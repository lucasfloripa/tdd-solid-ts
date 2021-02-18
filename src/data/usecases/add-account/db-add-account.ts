import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/usescases/add-account'
import { Encrypter } from '../../protocols/encrypter'

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
