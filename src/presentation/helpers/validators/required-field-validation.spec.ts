import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('Required Field Validation', () => {
  test('Should return a MissingparamError if a validation fails', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({ any: 'any' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({ field: 'any' })
    expect(error).toBeFalsy()
  })
})
