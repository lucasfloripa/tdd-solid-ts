export const serverErrorResponse = {
  description: 'Problema no servidor',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
