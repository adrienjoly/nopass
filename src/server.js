const RE_EMAIL = /[^@]+@[^@]+/

module.exports = class Server {

  constructor (db) {
    this.db = db
  }

  createFlow (params, callback) {
    this.db.pushData('/flows', {}, ({ key, value }) =>
      callback(null, {
        flowToken: key.split('/').pop()
      })
      // TODO: also return code/UI for login (email entry)
      // TODO: also return error + UI in case of error (e.g. too many retries)
    ) 
  }

  sendToFlow (flowToken = '', authParams = {}, callback) {
    this.db.fetchData('/flows/' + flowToken, ({ key, value }) => {
      if (!value) {
        callback(new Error('invalid flowToken'))
      } else if (!RE_EMAIL.test(authParams.email)) {
        callback(new Error('invalid email'))
      } else {
        // TODO: generate and store code in db
        // TODO: send code & link by email
        callback()
      }
    })
  }

}
