'use strict'
const joi = require('joi')
const express = require('express')
const bodyParser = require('body-parser')
const validate = require('../')
const app = express()

const querySchema = {
  query: {
    id: joi.string().required(),
    shoe: joi.string().required(),
    good: joi.number().required()
  }
}

const paramSchema = {
  params: {
    user_id: joi.number().required()
  }
}

const bodySchema = {
  body: {
    name: joi.string().optional(),
    surname: joi.string().required()
  }
}

const headerSchema = {
  headers: {
    'x-request-id': joi
      .string()
      .equal('skxksfjkdkdkd')
      .required()
  }
}

const return200 = (_, res) => {
  return res.sendStatus(200)
}

app
  .use(bodyParser.json())
  .get('/users', validate({ schema: querySchema }), return200)
  .get('/users/:user_id', validate({ schema: paramSchema }), return200)
  .post('/users', validate({ schema: bodySchema }), return200)
  .put('/users', validate({ schema: headerSchema }), return200)
  .use((err, req, res, next) => {
    return res.status(err.status).json({
      error: {
        message: err.message,
        details: err.details,
        name: err.name,
        status: err.status
      }
    })
  })

module.exports = app
