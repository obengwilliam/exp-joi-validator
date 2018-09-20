const { validationError } = require('@kudobuzz/express-error')

const getDetails = ({ context, message }) => {
  const value = context && context.value
  const key = context && context.key

  const newDetails = {
    message: message,
    param: key
  }

  if (value) newDetails.value = value + ''

  return newDetails
}

/**
 * Reformat joi errros to custom errors
 * @param {Error}
 * @return {Error}
 *
 */
module.exports = function reformatJoiErrors (joiError) {
  const details = joiError.details.map(getDetails)

  const error = validationError({
    message: 'error validating req parameters',
    details
  })

  error.status = 400
  return error
}
