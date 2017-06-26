var Server = require('../src/Server.js')
var Db = require('../lib/db-memory.js')

describe('Server: createFlow', function() {

  it('returns no error', function(done) {
    new Server(new Db()).createFlow({}, (err) =>
      done(expect(err).toBeFalsy()))
  })

  it('returns a flowToken', function(done) {
    new Server(new Db()).createFlow({}, (err, res) =>
      done(expect(res.flowToken).toBeTruthy()))
  })

})

describe('Server: sendToFlow', function() {

  it('fails if flowToken does not exist', function(done) {
    new Server(new Db()).sendToFlow(666, { email: 'test@test.com' }, (err) =>
      done(expect(err).toBeTruthy()))
  })

  it('fails if email is not valid', function(done) {
    var server = new Server(new Db())
    server.createFlow({}, (err, res) => {
      server.sendToFlow(res.flowToken, { email: 'test@' }, (err) =>
        done(expect(err).toBeTruthy()))
    })
  })

  it('succeeds if flowToken exists and email is valid', function(done) {
    var server = new Server(new Db())
    server.createFlow({}, (err, res) => {
      server.sendToFlow(res.flowToken, { email: 'test@test.com' }, (err) =>
        done(expect(err).toBeFalsy()))
    })
  })

})

describe('Server: checkFlow', function() {

  it('fails if flowToken does not exist', function(done) {
    new Server(new Db()).checkFlow(666, { code: 'XYZ' }, (err) =>
      done(expect(err).toBeTruthy()))
  })

  it('fails if code is not valid', function(done) {
    var server = new Server(new Db())
    server.createFlow({}, (err, res) => 
      server.sendToFlow(res.flowToken, { email: 'test@test.com' }, (err) =>
        server.checkFlow(res.flowToken, { code: 'XYZ' }, (err) =>
          done(expect(err).toBeTruthy()))))
  })

  it('succeeds if flowToken and code match', function(done) {
    var flowToken
    var fakeSendEmail = ({ to, code }) =>
      server.checkFlow(flowToken, { code }, (err) =>
        done(expect(err).toBeFalsy()))
    var server = new Server(new Db(), fakeSendEmail)
    server.createFlow({}, (err, res) => {
      flowToken = res.flowToken
      server.sendToFlow(res.flowToken, { email: 'test@test.com' }, () => {})
    })
  })

  it('fails when trying to re-use flowToken', function(done) {
    var flowToken
    var fakeSendEmail = ({ to, code }) =>
      server.checkFlow(flowToken, { code }, (err) =>
        server.checkFlow(flowToken, { code }, (err) =>
          done(expect(err).toBeTruthy())))
    var server = new Server(new Db(), fakeSendEmail)
    server.createFlow({}, (err, res) => {
      flowToken = res.flowToken
      server.sendToFlow(res.flowToken, { email: 'test@test.com' }, () => {})
    })
  })

})

