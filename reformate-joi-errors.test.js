const joi = require('joi')
const { expect } = require('chai')

const reformatJoiErrors = require('./reformat-joi-errors')

describe('Reformat joi errors', () => {
  let schema

  before(() => {
    schema = {
      client_id: joi.string().required(),
      client_secret: joi.string()
    }
  })

  it('should convert a joi error to a new error object', () => {
    const { error } = joi.validate({ client_secret: 4 }, schema)
    const newError = reformatJoiErrors(error)
    expect(newError).to.be.an('Error')
  })

  it('should contain all the required values', () => {
    const { error } = joi.validate({ client_secret: 4 }, schema)
    const newError = reformatJoiErrors(error)

    expect(newError.name).to.be.equal('ValidationError')
    expect(newError.message).to.be.equal('error validating req parameters')
    expect(newError.status).to.be.equal(400)

    newError.details.forEach(err => {
      expect(err).to.include.all.keys(['message', 'param'])
    })
  })

  it('should contain the right values when the wrong value is provided ', () => {
    const { error } = joi.validate({ client_secret: 4, client_id: 4 }, schema)
    const newError = reformatJoiErrors(error)

    newError.details.forEach(err => {
      expect(err.param).to.be.equal('client_id')
      expect(err.value).to.be.equal('4')
    })
  })

  it('should contain the right values when a value is required ', () => {
    const { error } = joi.validate({ client_secret: 'gylxkdks' }, schema)
    const newError = reformatJoiErrors(error)

    newError.details.forEach(err => {
      expect(err.param).to.be.equal('client_id')
      expect(err.value).to.equal(undefined)
    })
  })
})
