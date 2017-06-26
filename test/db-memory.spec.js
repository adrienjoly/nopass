var db = require('../lib/db-memory')

const TEST_VALUE = 'coucou'

describe('db-memory', function() {

  it('returns empty on initial fetch', function(done) {
    db.fetchData('/', ({ key, value }) =>
      done(expect(JSON.stringify(value)).toBe('{}')))
  })

  it('returns undefined when fetching /test', function(done) {
    db.fetchData('/test', ({ key, value }) =>
      done(expect(value).toBe(undefined)))
  })

  it('returns value at /test after setting it', function(done) {
    db.setData('/test', TEST_VALUE, function() {
      db.fetchData('/test', ({ key, value }) =>
        done(expect(value).toBe(TEST_VALUE)))
    })
  })

  it('returns { test: value } at / after setting it', function(done) {
    db.setData('/test', TEST_VALUE, function() {
      db.fetchData('/', ({ key, value }) =>
        done(
          expect(JSON.stringify(value))
            .toBe(JSON.stringify({ test: TEST_VALUE }))
        )
      )
    })
  })

})
