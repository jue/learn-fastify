'use strict'

const path = require('node:path')
const AutoLoad = require('@fastify/autoload')

// Pass --options via CLI arguments in command to enable these options.
module.exports.options = {}

module.exports = async function (fastify, opts) {
  // Place here your custom code!
  fastify.register(require('@fastify/swagger'), {
    swagger: {
      info: {
        title: '测试开发文档',
        description: '测试 Fastify 的 Swagger API',
        version: '0.1.0',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: '在这里找到更多信息',
      },
      host: '192.168.1.15:3000',
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header',
        },
      },
    },
  })

  fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    validatorUrl: 'https://validator.swagger.io/validator',
    theme: {
      title: '开发测试文档',
    },
    uiConfig: {
      docExpansion: 'list', // expand/not all the documentations none|list|full
      deepLinking: true,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next()
      },
      preHandler: function (request, reply, next) {
        next()
      },
    },
    staticCSP: false,
    transformStaticCSP: (header) => header,
    exposeRoute: true,
  })

  // fastify.ready((err) => {
  //   if (err) throw err
  //   fastify.swagger()
  // })

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts),
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign(
      {
        prefix: '/v1',
      },
      opts
    ),
  })

  // CORS support
  fastify.register(require('@fastify/cors'), {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
  })

  // Multipart form support
  fastify.register(require('@fastify/multipart'))
  fastify.register(require('@fastify/formbody'))

  // Executes Swagger
  // fastify.ready((err) => {
  //   if (err) throw err
  //   fastify.swagger()
  // })
}
