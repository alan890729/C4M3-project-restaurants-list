'use strict';

const rawData = require('../public/jsons/restaurant.json').results

function generateInitData() {
  const data = rawData.map(element => {
    const tempObj = {}

    Object.keys(element).filter(key => {
      if (key === 'id') {
        return false
      }
      return true
    }).forEach(key => {
      tempObj[key] = element[key]
    })

    tempObj.createdAt = new Date()
    tempObj.updatedAt = new Date()

    return tempObj
  })
  return data
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Restaurants', generateInitData())
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Restaurants', null)
  }
};
