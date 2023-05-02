'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users','address',
      {
        type: Sequelize.STRING(5000)
      },
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users','address')
  }
};
