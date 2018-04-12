const Sequelize = require('sequelize');

module.exports = {
    
           id: {
               autoIncrement: true,
               primaryKey: true,
               type: Sequelize.INTEGER
           },
    
           firstname: {
               type: Sequelize.STRING,
               notEmpty: true
           },
    
           lastname: {
               type: Sequelize.STRING,
               notEmpty: true
           },
    
           username: {
               type: Sequelize.TEXT
           },
    
           about: {
               type: Sequelize.TEXT
           },
    
           email: {
               type: Sequelize.STRING,
               validate: {
                   isEmail: true
               },
               notEmpty:true
           },
    
           password: {
               type: Sequelize.STRING,
               allowNull: false
           },
    
           last_login: {
               type: Sequelize.DATE,
               defaultValue: Sequelize.NOW
           },
    
           status: {
               type: Sequelize.ENUM('active', 'inactive'),
               defaultValue: 'active'
           }    
   }