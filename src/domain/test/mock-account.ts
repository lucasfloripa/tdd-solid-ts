import { AddAccountParams } from '@/data/usecases/account/add-account/db-add-account-protocols'
import { AccountModel } from '@/presentation/middlewares/auth-middleware-protocols'

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})
