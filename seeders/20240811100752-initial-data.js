'use strict';
const bcrypt = require('bcryptjs')

const rawRestaurantData = require('../public/jsons/restaurant.json').results
const rawUserData = require('../public/jsons/user.json').results

function generateInitData() {
  let counter = 0

  const data = rawRestaurantData.map(element => {
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
    tempObj.userId = counter < (rawRestaurantData.length / 2) ? 1 : 2

    counter++
    return tempObj
  })

  return data
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let transaction

    try {
      transaction = await queryInterface.sequelize.transaction()

      const userData = await Promise.all(
        rawUserData.map(async (userData, i) => {
          const hash = await bcrypt.hash(userData.password, 10)
          return {
            id: i + 1,
            email: userData.email,
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
      )

      await queryInterface.bulkInsert(
        'Users',
        userData,
        { transaction }
      )

      await queryInterface.bulkInsert('Restaurants', generateInitData(), { transaction })

      await transaction.commit()
    } catch (err) {
      if (transaction) {
        console.error(err)
        transaction.rollback()
      }
    }

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null)
  }
};
