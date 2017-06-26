const uuid = require('uuid')

const RE_EMAIL = /[^@]+@[^@]+/

module.exports = class Server {

  constructor (db, sendEmail) {
    this.db = db
    this.sendEmail = sendEmail || console.log.bind(console, '[EMAIL]')
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
        const code = uuid()
        this.db.setData('/flows/' + flowToken, { code }, () => {
          this.sendEmail({
            to: authParams.email,
            code,
            // TODO: also send text and html version of email body
          })
          // TODO: handle error of sendEmail, if any
          callback()
        })
      }
    })
  }

  checkFlow (flowToken = '', codeParams = {}, callback) {
    this.db.fetchData('/flows/' + flowToken, ({ key, value = {} }) => {
      if (!value || !value.code) {
        callback(new Error('invalid flowToken'))
      } else if (codeParams.code !== value.code) {
        // delete flow, then return error
        this.db.setData('/flows/' + flowToken, undefined, () =>
          callback(new Error('invalid code')))
      } else {
        // delete flow, then respond
        this.db.setData('/flows/' + flowToken, undefined, () =>
          callback())
      }
    })    
  }

}
