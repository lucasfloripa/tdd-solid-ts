import { AccountModel } from '../../domain/models/account'
import { AddAccountModel } from '../../domain/usescases/add-account'

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>
}
