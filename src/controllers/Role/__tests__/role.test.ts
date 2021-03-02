import request from 'supertest'
// @ts-ignore
import app from '../../../app'

jest.useFakeTimers()

describe('Get Role Routes', () => {
  it('should be get all role data', (done) => {
    request(app)
      .get('/v1/role')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401, done)
  })
})
