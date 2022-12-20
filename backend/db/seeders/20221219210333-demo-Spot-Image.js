'use strict';
const bcrypt = require('bcryptjs')

let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   options.tableName = 'SpotImages'
   await queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      url: "image url",
      preview: true
    },
    {
      spotId: 2,
      url: "image url 2",
      preview: false
    },
    {
      spotId: 3,
      url: "image url 3",
      preview: true
    },
   ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages'
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3]}
    })
  }
};
