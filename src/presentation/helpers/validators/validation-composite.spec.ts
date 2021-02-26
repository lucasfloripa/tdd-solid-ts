import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: ValidationComposite
  validationsStub: Validation
}

const makeSut = (): SutTypes => {
  const validationsStub = makeValidation()
  const sut = new ValidationComposite([validationsStub])
  return { sut, validationsStub }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationsStub } = makeSut()
    jest.spyOn(validationsStub, 'validate').mockImplementationOnce(() => { return new Error() })
    const error = sut.validate('any_value')
    expect(error).toEqual(new Error())
  })

  // test('Should not return if validation succeeds', () => {
  //   const sut = makeSut()
  //   const error = sut.validate({
  //     field: 'any_value',
  //     fieldToCompare: 'any_value'
  //   })
  //   expect(error).toBeFalsy()
  // })
})
