'use strict'
module.exports = function ({ req, schemaKeys }) {
  return schemaKeys.reduce((acc, key) => {
    acc[key] = req[key]
    return acc
  }, {})
}
