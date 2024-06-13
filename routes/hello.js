const hello = async (fastify, opts) => {
  fastify.get('/hello', async (request, reply) => {
    // reply.headers({ 'Content-Type': 'text/html' })
    // return reply.status(400).send('Hello World')
    return { hello: 'world--' }
    // return reply.status(404).send({
    //   message: 'Hello World',
    // })
  })

  fastify.get('/hello/:name', async (request, reply) => {
    return { hello: request.params.name }
  })
}

module.exports = hello
