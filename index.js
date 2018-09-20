'use strict'

const joi = require('joi')
const getDetailsToValidate = require('./get-object-to-validate')
const reformatJoiErrors = require('./reformat-joi-errors')
const joiOptions = { stripUnknown: true }

const defaultOptions = {
  joiOptions
}

const validSchemaKeys = ['query', 'params', 'body', 'headers']

// Todo: throw using custom errors
const required = name => {
  throw new Error(`missing parameter ${name}`)
}
// Todo: throw using custom errors
const throwInvalidKeys = _ => {
  throw new Error(`InvalidKeys, keys should be ${validSchemaKeys.concat(' ')}`)
}

const ensureIsValidSchema = schema => {
  return (
    Object.keys(schema).every(key => validSchemaKeys.includes(key)) ||
    throwInvalidKeys()
  )
}

/**
 * Validate req "query", "body", "headers", using joi schema

 * @params {Object} options
 * @params {Object} options.schema
 * @params {Objection} options.options
 * @returns {Function} Express middleware
 *
 */
module.exports = function ({
  schema = required('schema'),
  options = defaultOptions
} = {}) {
  return (
    ensureIsValidSchema(schema) &&
    function (req, res, next) {
      const { error } = joi.validate(
        getDetailsToValidate({ req, schemaKeys: Object.keys(schema) }),
        joi.object(schema).unknown(),
        joiOptions
      )

      return error ? next(reformatJoiErrors(error)) : next()
    }
  )
}
