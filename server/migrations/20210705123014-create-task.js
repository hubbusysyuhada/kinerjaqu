'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tasks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      tanggal: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deadline: {
        allowNull: false,
        type: Sequelize.DATE
      },
      kinerja: {
        allowNull: false,
        type: Sequelize.STRING
      },
      keterangan: {
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      input: Sequelize.STRING,
      hasil: Sequelize.STRING,
      AccountId: {
        type: Sequelize.STRING,
        references: {
          model: "Accounts",
          key: "id"
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Tasks');
  }
};