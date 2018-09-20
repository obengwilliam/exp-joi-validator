'use strict'

const { expect } = require('chai')
const getDetailsToValidate = require('./get-object-to-validate')

describe('getDetailsToValidate()', () => {
  let req

  before(() => {
    req = {
      query: { id: 243, email: 'obeng@gmail.com' },
      params: { id: 456 },
      headers: { 'X-RequestId': 23 },
      body: { gender: 'm' }
    }
  })

  it('should be a function', () => {
    expect(getDetailsToValidate).to.be.a('Function')
  })

  it('should return the details to be validated from the req body when schemaKeys contains only "body"', () => {
    const schemaKeys = ['body']

    const detailsToValidate = { body: req.body }

    expect(getDetailsToValidate({ req, schemaKeys })).to.eql(detailsToValidate)
  })

  it('should return the details to be validated from the req params when schemaKeys contains only "params"', () => {
    const schemaKeys = ['params']

    let detailsToValidate = { params: req.params }

    expect(getDetailsToValidate({ req, schemaKeys })).to.eql(detailsToValidate)
  })

  it('should return the details to be validated from the req headers when schemaKeys contains only "headers"', () => {
    const schemaKeys = ['headers']

    const detailsToValidate = { headers: req.headers }

    expect(getDetailsToValidate({ req, schemaKeys })).to.eql(detailsToValidate)
  })

  it('should return the details to be validated from the req query when schemaKeys contains only "query"', () => {
    const schemaKeys = ['query']

    const detailsToValidate = { query: req.query }

    expect(getDetailsToValidate({ req, schemaKeys })).to.eql(detailsToValidate)
  })

  it('should return the details to be validated from the req when schemaKeys contains "body" ,"headers", "params" and "query"', () => {
    const schemaKeys = ['query', 'headers', 'body', 'params']
    expect(getDetailsToValidate({ req, schemaKeys })).to.eql(req)
  })
})
