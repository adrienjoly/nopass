var DB = require('../lib/db-memory')

const TEST_VALUE = 'coucou'

Object.prototype.values = Object.prototype.values || ((obj) =>
  Object.keys(obj).map(field => obj[field]));

describe('db-memory', function() {

  it('returns empty on initial fetch', function(done) {
    new DB().fetchData('/', ({ key, value }) =>
      done(expect(JSON.stringify(value)).toBe('{}')))
  })

  it('returns undefined when fetching /test', function(done) {
    new DB().fetchData('/test', ({ key, value }) =>
      done(expect(value).toBe(undefined)))
  })

  it('returns value at /test after setting it', function(done) {
    var db = new DB()
    db.setData('/test', TEST_VALUE, function() {
      db.fetchData('/test', ({ key, value }) =>
        done(expect(value).toBe(TEST_VALUE)))
    })
  })

  it('returns { test: value } at / after setting it', function(done) {
    var db = new DB()
    db.setData('/test', TEST_VALUE, function() {
      db.fetchData('/', ({ key, value }) =>
        done(
          expect(JSON.stringify(value))
            .toBe(JSON.stringify({ test: TEST_VALUE }))
        )
      )
    })
  })

  /*
  it('returns { test2: { test: value } } after setting /test2/test', function(done) {
    var db = new DB()
    db.setData('/test2/test', TEST_VALUE, function() {
      db.fetchData('/', ({ key, value }) =>
        done(
          expect(JSON.stringify(value))
            .toBe(JSON.stringify({ test2: { test: TEST_VALUE }}))
        )
      )
    })
  })
  */

  it('returns { (uuid) : value } after pushing to /testpush', function(done) {
    var db = new DB()
    db.pushData('/testpush', TEST_VALUE, function() {
      db.fetchData('/testpush', ({ key, value }) =>
        done(
          expect(Object.values(value).join(''))
            .toBe(TEST_VALUE)
        )
      )
    })    
  })

})
