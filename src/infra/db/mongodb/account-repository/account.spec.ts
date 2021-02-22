import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const makeSut = (): any => {
  const sut = new AccountMongoRepository()
  return { sut }
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(accountData).toBeTruthy()
    expect(accountData.id).toBeTruthy()
    expect(accountData.name).toBe('any_name')
    expect(accountData.email).toBe('any_email@mail.com')
    expect(accountData.password).toBe('any_password')
  })
})
