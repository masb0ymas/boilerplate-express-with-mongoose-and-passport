/* eslint-disable no-undef */
import request from 'supertest'
// @ts-ignore
import app from '../../../app'

jest.useFakeTimers()

describe('Get Auth Routes', () => {
  it('should be empty form data register', (done) => {
    request(app)
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
      .expect(422, done)
  })

  it('should be empty form data login', (done) => {
    request(app)
      .post('/v1/auth/sign-in')
      .send({
        email: '',
        password: '',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done)
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
