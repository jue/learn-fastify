// 'use strict'
// module.exports = async function (fastify, opts) {
//   fastify.get('/', async function (request, reply) {
//     return 'users root'
//   })
//   fastify.post('/', async function (request, reply) {
//     const data = request.body
//     return `user subscribed: ${data.name} ${data.surname} (${data.email})`
//   })
//   fastify.put('/', async function (request, reply) {
//     const data = request.body
//     return `user updated: ${data.name} ${data.surname} (${data.email})`
//   })
//   fastify.delete('/', async function (request, reply) {
//     const data = request.body
//     return `user deleted: ${data.id}`
//   })
// }

'use strict'

const UserService = require('../../service/user')

module.exports = async function (fastify, opts) {
  const userService = new UserService(fastify)

  fastify.get(
    '/list',
    {
      schema: {
        summary: '获取用户列表',
        description: '返回所有用户数据',
        tags: ['用户接口'],
      },
    },
    async function (request, reply) {
      const users = await userService.getAll()
      return { users }
    }
  )

  fastify.route({
    url: '/info/:id',
    method: ['GET'],
    security: [
      {
        apiKey: [],
      },
    ],
    // request and response schema
    schema: {
      summary: '获取用户明细',
      description: '返回用户数据',
      tags: ['用户接口'],

      // (or query) validates the querystring
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: '用户uid',
          },
        },
      },
      // the response needs to be an object with an `hello` property of type 'string'
      response: {
        200: {
          description: '返回用户数据',
          type: 'object',
          properties: {
            id: {
              type: 'number',
              format: 'uuid',
            },
            firstName: {
              type: 'string',
            },
            lastName: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
          },
        },
        404: {
          description: '没有找到用户',
          type: 'object',
          properties: {
            code: {
              type: 'string',
            },
            message: {
              type: 'string',
            },
          },
        },
      },
    },
    // called just before the request handler
    preHandler: async (request, reply) => {
      const { id } = request.params
      if (id <= 0) {
        reply.code(404).send({
          code: 'USER_NOT_FOUND',
          message: `The user #${id} not found!`,
        })
        return null
      }
    },
    // the function that will handle this request
    handler: async (request, reply) => {
      return request.params
    },
  })
}
