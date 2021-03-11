import { RequiredFieldValidation } from '.'
import { MissingParamError } from '../../presentation/errors'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe('Required Field Validation', () => {
  test('Should return a MissingparamError if a validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ any: 'any' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any' })
    expect(error).toBeFalsy()
  })
})
