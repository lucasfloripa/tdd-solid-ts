import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

const makeSut = (): any => {
  const sut = new AccountMongoRepository()
  return { sut }
}

describe('Account Mongo Repository', () => {
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should return an account on add success', async () => {
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

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const { sut } = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const accountData = await sut.loadByEmail('any_email@mail.com')
      expect(accountData).toBeTruthy()
      expect(accountData.id).toBeTruthy()
      expect(accountData.name).toBe('any_name')
      expect(accountData.email).toBe('any_email@mail.com')
      expect(accountData.password).toBe('any_password')
    })

    test('Should return null if loadByEmail fails', async () => {
      const { sut } = makeSut()
      const accountData = await sut.loadByEmail('any_email@mail.com')
      expect(accountData).toBeFalsy()
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken without role', async () => {
      const { sut } = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      })
      const accountData = await sut.loadByToken('any_token')
      expect(accountData).toBeTruthy()
      expect(accountData.id).toBeTruthy()
      expect(accountData.name).toBe('any_name')
      expect(accountData.email).toBe('any_email@mail.com')
      expect(accountData.password).toBe('any_password')
    })

    test('Should return null if loadByEmail fails', async () => {
      const { sut } = makeSut()
      const accountData = await sut.loadByEmail('any_email@mail.com')
      expect(accountData).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const { sut } = makeSut()
      const result = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const fakeAccount = result.ops[0]
      expect(fakeAccount.accessToken).toBeFalsy()
      await sut.updateAccessToken(fakeAccount._id, 'any_token')
      const accountData = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(accountData).toBeTruthy()
      expect(accountData.accessToken).toBe('any_token')
    })
  })
})
