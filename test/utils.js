const { expect } = require('chai')

const expectApiErrorsToBeWellFormatted = err => {
  expect(err.error).to.have.all.keys(['name', 'status', 'message', 'details'])
  expect(err.error.status).to.be.equal(400)
  expect(err.error.name).to.be.equal('ValidationError')
  expect(err.error.message).to.be.equal('error validating req parameters')

  err.error.details.forEach(err => {
    expect(err).to.include.all.keys(['message', 'param'])
  })
}

module.exports = function () {
  return {
    expectApiErrorsToBeWellFormatted
  }
}
