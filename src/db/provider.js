const data = require('./data');
const _ = require('lodash');

module.exports = {
  get(modelName, id) {
    if (id) {
      return data[modelName].find(m => m.id == id);
    }
    return data[modelName];
  },
  set(modelName, datum) {
    const modelData = data[modelName]
    const existing = modelData.find(m => m.id == datum.id);
    if (existing) {
      _.merge(existing, datum);
      return existing;
    }
    datum.id = modelData[modelData.length - 1].id + 1;
    modelData.push(datum);
    return datum;
  },
  delete(modelName, id) {
    const modelData = data[modelName]
    data[modelName] = modelData.filter(obj => obj.id !== id);
    return { id };
  }
}
