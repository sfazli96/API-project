'use strict';
const bcrypt = require('bcryptjs')

let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages'
    await queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: "url"
      },
      {
        reviewId: 2,
        url: "url-2"
      },
      {
        reviewId: 3,
        url: "url-3"
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages'
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      url: { [Op.in]: ["url", "url-2", "url-3"]}
    })
  }
};
