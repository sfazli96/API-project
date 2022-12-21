'use strict';
const bcrypt = require('bcryptjs')

let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   options.tableName = 'Spots'
   await queryInterface.bulkInsert(options, [
    {
      ownerId: 1,
      address: "456 trust lane",
      city: "San Jose",
      state: "California",
      country: "United States of America",
      lat: 57.7645358,
      lng: -162.4730327,
      name: "BootCamp test",
      description: "This is a bootcamp test place",
      price: 633,
      avgRating: 4.2,
      previewImage: 'image url'
    },
    {
      ownerId: 2,
      address: "789 frank street",
      city: "Long Island",
      state: "New York",
      country: "United States of America",
      lat: 87.7645358,
      lng: -112.4730327,
      name: "Long Island Test",
      description: "This is a long island test place",
      price: 153,
      avgRating: 3.2,
      previewImage: 'image url 2'
    },
    {
      ownerId: 3,
      address: "026 verizon lane",
      city: "San Jose",
      state: "California",
      country: "United States of America",
      lat: 57.7645358,
      lng: -162.4730327,
      name: "BootCamp test 2",
      description: "This is a bootcamp test place",
      price: 633,
      avgRating: 2.5,
      previewImage: 'image url 3'
    },
   ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots'
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['BootCamp test', 'Long Island Test', 'BootCamp test 2'] }
    }, {})
  }
};
