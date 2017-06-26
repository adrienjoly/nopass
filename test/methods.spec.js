var methods = require('../src/methods.js')

describe('methods: createFlow', function() {

  it('returns no error', function(done) {
    methods.createFlow({}, (err) =>
      done(expect(err).toBeFalsy))
  })

})
