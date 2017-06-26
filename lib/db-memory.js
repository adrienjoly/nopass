var uuid = require('uuid')

const dataContainer = { data: {} };

const init = () => {};

const getPath = (path) => {
  var arr = ['data'].concat(path.split('/').filter(s => s && s.length));
  var last = arr.pop();
  return { arr, last };
}

const getParentRef = (path) => {
  var pathArray = getPath(path).arr;
  //console.log('path:', pathArray);
  return pathArray.reduce((current, field) => {
    //console.log('field:', field, '->', current[field])
    return current[field]
  }, dataContainer);
}

// calls back once with { key, value }
const fetchData = (path = '/', cb = console.log) => {
  //console.log('[fetchData] last field', getPath(path).last);
  cb({ key: path, value: (getParentRef(path) || {})[getPath(path).last] });
}

// calls back with { key }
const setData = (path = '/', data, cb = console.log) => {
  //console.log('[setData] last field', getPath(path).last);
  cb({ key: path, value: getParentRef(path)[getPath(path).last] = data });
}

const pushData = (path = '/', data, cb = console.log) => {
  setData(path, {}, () =>
    setData(path + '/' + uuid(), data, cb)
  );
}

module.exports = {
  init,
  fetchData,
  setData,
  pushData,
};
