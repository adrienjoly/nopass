const uuid = require('uuid')

const RE_EMAIL = /[^@]+@[^@]+/

/* Represents a login service. */
class Server {

  /**
   * Initialize a user login server.
   * @param {object} db - A database instance that stores the login flows.
   * @param {function} db.fetchData - To fetch a flow from the database.
   * @param {function} db.setData - To add/update a flow in the database.
   * @param {function} sendEmail - A function that will be called to send emails.
   */
  constructor (db, sendEmail) {
    this.db = db
    this.sendEmail = sendEmail || console.log.bind(console, '[EMAIL]')
  }

  /**
   * Initiate a user login flow. To be called when rendering a user's login UI.
   * @param {object} params - A database instance that stores the login flows.
   * @param {function} params.fetchData - To fetch a flow from the database.
   * @param {function} params.setData - To add/update a flow in the database.
   * @param {function} callback - A function that will be called to send emails.
   */
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

module.exports = Server
