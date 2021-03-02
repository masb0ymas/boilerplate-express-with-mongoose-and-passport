import request from 'supertest'
// @ts-ignore
import app from '../../app'

describe('Get Index Routes', () => {
  it('should be render index route', (done) => {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, done)
  })

  it('should be render v1 route', (done) => {
    request(app)
      .get('/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(403, done)
  })
})
