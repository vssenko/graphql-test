const db = require('../db/provider');

module.exports = {
  get(model, id) {
    return db.get(model, id);
  },
  insert(model, id) {
    return db.set(model, id);
  },
  update(model, id) {
    return db.set(model, id);
  },
  delete(model, id) {
    return db.delete(model, id);
  }
}