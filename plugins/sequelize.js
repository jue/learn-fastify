'use strict'

const fp = require('fastify-plugin')
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const models = __dirname + '/../model'

module.exports = fp(async (fastify, opts) => {
  const db = {}

  const config = {
    username: 'root',
    password: 'e9d91e4fa4f66650',
    database: 'fastify_db',
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    operatorsAliases: 0,
    define: {
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',

      timestamps: true,
      freezeTableName: true,
    },

    logging: (msg) => fastify.log.debug(msg),
  }

  // Create new instance
  const sequelize = new Sequelize(config)

  // Import models
  fs.readdirSync(models)
    .filter(
      (file) =>
        file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
    .forEach((file) => {
      const model = require(path.join(models, file))(
        sequelize,
        Sequelize.DataTypes
      )
      db[model.name] = model
    })

  // Create database relationships
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) db[modelName].associate(db)
  })

  db.sequelize = sequelize
  db.Sequelize = Sequelize

  // Sync models in development
  if (process.env.NODE_ENV === 'development') {
    await sequelize.sync({ alter: true })
  }

  // Make sequelize available to entire application
  fastify.decorate('sequelize', db)

  // Close connection
  fastify.addHook('onClose', async () => await sequelize.close())
})
