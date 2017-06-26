var firebase = require('firebase');

const init = firebase.initializeApp.bind(firebase)

const getServerTimestamp = () => firebase.database.ServerValue.TIMESTAMP

// (used by push/set/update functions, to translate callback results)
const pushSnapshotTo = (snapshot, callback) => callback({
  key: snapshot.key,
  _firebaseSnapshot: snapshot,
})

// calls back once with { key, value, _firebaseSnapshot }
const fetchData = (path, fct) =>
  firebase.database().ref(path).once('value', (snapshot) => fct({
    key: snapshot.key,
    value: snapshot.val(),
    _firebaseSnapshot: snapshot,
  }))

// calls back reactively with { key, value, _firebaseSnapshot }
const subscribeToData = (path, fct) =>
  firebase.database().ref(path).on('value', (snapshot) => fct({
    key: snapshot.key,
    value: snapshot.val(),
    _firebaseSnapshot: snapshot,
  }))

const unsubscribeToData = (path, fct) =>
  firebase.database().ref(path).off('value', fct)

// calls back with { key, _firebaseSnapshot }
const pushData = (path, data, callback) =>
  pushSnapshotTo(firebase.database().ref(path).push(data), callback)

// calls back with { key, _firebaseSnapshot }
const setData = (path, data, callback) =>
  pushSnapshotTo(firebase.database().ref(path).set(data), callback)

/*
const updateData = (path, data, callback) =>
  pushSnapshotTo(firebase.database().ref(path).update(data), callback)
*/

module.exports = {
  init,
  getServerTimestamp,
  fetchData,
  subscribeToData,
  unsubscribeToData,
  pushData,
  setData,
};
