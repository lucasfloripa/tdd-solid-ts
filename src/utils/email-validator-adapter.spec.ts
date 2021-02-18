import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false (integration test)', () => {
    const sut = new EmailValidatorAdapter()
    const isValid: boolean = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
})
