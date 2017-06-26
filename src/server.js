module.exports = class Server {

  constructor (db) {
    this.db = db
  }

  createFlow (params, callback) {
    this.db.pushData('/flows', {}, ({ key, value }) =>
      callback(null, { flowToken: key.split('/').pop() })
    )
    
  }

}
