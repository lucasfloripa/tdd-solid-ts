import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'
import { ValidationComposite } from './validation-composite'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

type SutTypes = {
  sut: ValidationComposite
  validationsStub: Validation[]
}

const makeSut = (): SutTypes => {
  const validationsStub = [
    makeValidation(),
    makeValidation()
  ]
  const sut = new ValidationComposite(validationsStub)
  return { sut, validationsStub }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationsStub } = makeSut()
    jest.spyOn(validationsStub[0], 'validate').mockReturnValueOnce(new Error())
    const error = sut.validate('any_value')
    expect(error).toEqual(new Error())
  })

  test('Should return first error if nome then one validation fails', () => {
    const { sut, validationsStub } = makeSut()
    jest.spyOn(validationsStub[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationsStub[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate('any_value')
    expect(error).toEqual(new Error())
  })

  test('Should not return if any validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate('any_value')
    expect(error).toBeFalsy()
  })
})
