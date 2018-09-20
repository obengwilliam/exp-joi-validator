'use strict'
const joi = require('joi')
const request = require('supertest')
const { expect } = require('chai')

const app = require('./examples/app')
const validate = require('./index')
const { expectApiErrorsToBeWellFormatted } = require('./test/utils')()

const api = request(app)

describe('Validation Spec', () => {
  it('should fail if "schema" is not provided ', () => {
    expect(_ => validate({})).throw('missing parameter schema')
  })

  it('should not fail when options are not provided', () => {
    const query = { name: joi.string().required() }

    expect(_ => validate({ schema: { query } })).to.not.throw()
  })

  it('should fail when key is unknown', () => {
    const qeury = { name: joi.string().required() }
    expect(_ => validate({ schema: { qeury } })).to.throw(
      'InvalidKeys, keys should be query,params,body,headers,'
    )
  })

  it('should return a function', () => {
    const params = { id: joi.string().required() }

    expect(_ => validate({ schema: { params } })).to.be.a('Function')
  })

  describe('Query', () => {
    it('should pass the right error to the next error middleware handler', () => {
      return api
        .get('/users')
        .expect(400)
        .then(({ text }) => {
          const err = JSON.parse(text)
          expectApiErrorsToBeWellFormatted(err)
        })
    })

    it('should not fail if "querystrings" meets the schema', () => {
      return api
        .get('/users')
        .query({ id: 4, shoe: 45, good: 32 })
        .expect(200)
    })

    it('should not fail when there are "unknowns"', () => {
      return api.get('/users?id=4&name=unknown&shoe=45&good=2').expect(200)
    })
  })

  describe('Params', () => {
    it('should pass the right error to the next error middleware handler', () => {
      return api
        .get('/users/hmmm')
        .expect(400)
        .then(({ text }) => {
          const error = JSON.parse(text)
          expectApiErrorsToBeWellFormatted(error)
        })
    })
    it('should not fail if "params" meets the schema', () => {
      return api.get('/users/20').expect(200)
    })
  })

  describe('Headers', () => {
    it('should pass the right error to the next error middleware handler', () => {
      return api
        .put('/users')
        .set({ 'x-request-id': 40 })
        .expect(400)
        .then(({ text }) => {
          const error = JSON.parse(text)
          expectApiErrorsToBeWellFormatted(error)
        })
    })

    it('should not fail if "params" meets the schema', () => {
      return api
        .put('/users')
        .set({ 'x-request-id': 'skxksfjkdkdkd' })
        .expect(200)
    })
  })

  describe('Body', () => {
    it('should pass the right error to the next error middleware handler', () => {
      return api
        .post('/users')
        .send({
          name: 'william'
        })
        .expect(400)
        .then(({ text }) => {
          const error = JSON.parse(text)
          expectApiErrorsToBeWellFormatted(error)
        })
    })
    it('should not fail if "body" meets the schema', () => {
      return api
        .post('/users')
        .send({
          name: 'william',
          surname: 'obeng'
        })
        .expect(200)
    })
  })
})
