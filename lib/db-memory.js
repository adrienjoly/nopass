var uuid = require('uuid')

const getPath = (path) => {
  var arr = ['data'].concat(path.split('/').filter(s => s && s.length));
  var last = arr.pop();
  return { arr, last };
}

function MemoryDb() {
  this.dataContainer = { data: {} };
}

MemoryDb.prototype.getParentRef = function (path) {
  var pathArray = getPath(path).arr;
  //console.log('path:', pathArray);
  return pathArray.reduce((current, field) => {
    //console.log('field:', field, '->', current[field])
    return current[field]
  }, this.dataContainer);
}

// calls back once with { key, value }
MemoryDb.prototype.fetchData = function (path = '/', cb = console.log) {
  //console.log('[fetchData] last field', getPath(path).last);
  cb({ key: path, value: (this.getParentRef(path) || {})[getPath(path).last] });
}

// calls back with { key }
MemoryDb.prototype.setData = function (path = '/', data, cb = console.log) {
  //console.log('[setData] last field', getPath(path).last);
  cb({ key: path, value: this.getParentRef(path)[getPath(path).last] = data });
}

MemoryDb.prototype.pushData = function (path = '/', data, cb = console.log) {
  this.setData(path, {}, () =>
    this.setData(path + '/' + uuid(), data, cb)
  );
}

module.exports = MemoryDb;
