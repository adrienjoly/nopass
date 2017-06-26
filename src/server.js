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

}
