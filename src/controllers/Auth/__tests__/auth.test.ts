import request from 'supertest'
// @ts-ignore
import app from '../../../app'

describe('Endpoint Auth Routes', () => {
  it('should be empty form data register', async (done) => {
    try {
      const response = await request(app)
        .post('/v1/auth/sign-up')
        .send({
          fullName: '',
          email: '',
          phone: '',
          newPassword: '',
          confirmNewPassword: '',
          Role: '',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      // @ts-ignore
      expect(422).toEqual(response.statusCode)

      done()
    } catch (err) {
      return done(err)
    }
  })
})

describe('Endpoint Auth Login', () => {
  it('should be empty form data login', async (done) => {
    try {
      const response = await request(app)
        .post('/v1/auth/sign-in')
        .send({
          email: '',
          password: '',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      // @ts-ignore
      expect(422).toEqual(response.statusCode)

      done()
    } catch (err) {
      return done(err)
    }
  })

  it('should be login account', (done) => {
    request(app)
      .post('/v1/auth/sign-in')
      .send({
        email: 'guest@mail.com',
        password: 'guest123',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done)

    done()
  }, 30000)
})

jest.useFakeTimers()
