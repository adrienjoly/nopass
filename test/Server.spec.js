var Server = require('../src/Server.js')
var db = require('../lib/db-memory.js')
var server = new Server(db)

describe('Server: createFlow', function() {

  it('returns no error', function(done) {
    server.createFlow({}, (err) =>
      done(expect(err).toBeFalsy))
  })

})
