'use strict';
const bcrypt = require('bcryptjs')

let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Users'
   await queryInterface.bulkInsert(options, [
    {
      email: 'demo@user.io',
      username: 'Demo-lition',
      hashedPassword: bcrypt.hashSync('password'),
      firstName: 'Demo',
      lastName: 'letion'
    },
    {
      email: 'user1@user.io',
      username: 'FakeUser1',
      hashedPassword: bcrypt.hashSync('password2'),
      firstName: 'Demo1',
      lastName: 'Horner'
    },
    {
      email: 'user2@user.io',
      username: 'FakeUser2',
      hashedPassword: bcrypt.hashSync('password3'),
      firstName: 'Demo2',
      lastName: 'longer'
    }
   ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users'
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {})
  }
};
