import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('Should enable an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Lucas',
        email: 'lucasg@mail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
