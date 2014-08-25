#!/usr/bin/env node

Q = require('q');

module.exports = function(sequelize, DataType) {

    var Keyword = sequelize.define('Keyword', {

        name: {
            type: DataType.STRING,
            allowNull: false,
            unique: true
        },

        description: {
            type: DataType.TEXT,
            allowNull: true,
            defaultValue: 'No description'
        }

    }, {

        classMethods: {

            new: function(name, description) {

                return Keyword.build({
                        name: name,
                        description: description
                    })
                    .save();

            },

            findByName: function(name) {
                return Keyword.find({
                    where: {
                        name: name
                    }
                });
            },

            /*
             * return keyword (create a new one if it doesn't exist in table)
             * 
             * @param name:
             *        keyword name
             *  
             */
            getByName: function(name) {

                var promiseArr = [];
                var promise1 = Keyword.findByName(name);
                promiseArr.push(promise1);
                promise1.success(function (keyword) {
                    if (keyword === null)
                        promiseArr.push(Keyword.new(name, 'No description'));
                });

                return Q.all(promiseArr).then(function(results){
                    if (results[0] === null)
                        return results[1];
                    return results[0];
                });
            }

        },

        instanceMethods: {}

    });

    return Keyword;

};
