const Sequelize = require('sequelize');

module.exports = url => {
    
    class DbService extends Sequelize {
        constructor(url){
            super(url);
            this.dbaModels = {
                userInfo:require('./userModel.js')
            };       
            this.dbaObjects = {};
        }
        
        defineDbaObject(name){
            this.dbaObjects[name] = this.define(name, this.dbaModels[name]);
        }
        
        insertOne (name, payload){
            return this.dbaObjects[name].create(payload);
        }

        insertMany(name, payload){
            return this.dbaObjects[name].bulkCreate(payload);
        }
        findOneUser(id){
            return this.dbaObjects.userInfo.findOne({ where: {id:id} });
        }
    }
    return new DbService(url);
}