import { Validation } from '@/presentation/protocols'
import { mockEmailValidator } from '@/validation/test'
import { RequiredFieldValidation, EmailValidation, ValidationComposite } from '@/validation/validators'
import { makeLoginValidation } from './login-validation-factory'

jest.mock('../../../../../validation/validators/validation-composite')

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', mockEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
