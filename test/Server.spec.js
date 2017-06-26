var Server = require('../src/Server.js')
var Db = require('../lib/db-memory.js')
var server = new Server(new Db())

describe('Server: createFlow', function() {

  it('returns no error', function(done) {
    server.createFlow({}, (err) =>
      done(expect(err).toBeFalsy))
  })

  it('returns a flowToken', function(done) {
    server.createFlow({}, (err, res) =>
      done(expect(res.flowToken).toBeTruthy()))
  })

})
