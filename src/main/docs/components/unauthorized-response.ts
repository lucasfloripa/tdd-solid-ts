export const unauthorizedResponse = {
  description: 'Credencias Inválidas',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
