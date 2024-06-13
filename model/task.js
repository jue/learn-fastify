'use strict'

module.exports = (sequelize, DataTypes) =>
  sequelize.define('task', {
    tid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '-',
    },
  })
