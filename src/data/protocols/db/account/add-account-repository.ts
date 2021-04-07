import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usescases/account/add-account'

export interface AddAccountRepository {
  add: (accountData: AddAccountParams) => Promise<AccountModel>
}
