#!/usr/bin/env node


module.exports =  function (sequelize, DataType) {

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

            new: function (name, description) {
        
                return Keyword.build({
                    name: name,
                    description: description
                })
                .save();
                
            },
            
            findByName: function (name) {
                return Keyword.find({where: {name: name}});
            }

        },
        
        instanceMethods: {}
        
    });

    return Keyword;

};

