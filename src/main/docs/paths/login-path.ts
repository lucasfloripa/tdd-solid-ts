export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'Elciess SignUp',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account'
            }
          }
        }
      },
      400: {
        $ref: '#/schemas/badRequestResponse'
      },
      401: {
        $ref: '#/schemas/unauthorizedResponse'
      },
      404: {
        $ref: '#/schemas/notFoundResponse'
      },
      500: {
        $ref: '#/schemas/serverErrorResponse'
      }
    }
  }
}
