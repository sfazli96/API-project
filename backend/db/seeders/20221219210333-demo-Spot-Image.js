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
      url: "https://a0.muscache.com/im/pictures/68bc4aab-a736-417f-b7b6-ff2f1036bfc0.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 2,
      url: "https://a0.muscache.com/im/pictures/90c7a7eb-2182-4287-960d-5e31c94c5545.jpg?im_w=720",
      preview: true
    },
    {
      spotId: 3,
      url: "https://a0.muscache.com/im/pictures/d3fff78e-831b-4189-ac41-d4c0d7fc50ef.jpg?im_w=720",
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
