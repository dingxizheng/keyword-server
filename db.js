#!/usr/bin/env node

var Sequelize = require('sequelize');

var sequelize = new Sequelize('keywords', 'root', null,
    {
        sync: { force: false },
        
        syncOnAssociation: true,
    }
);

var syncTables = function (force) {
    sequelize
         .sync({force: force})
         .complete(function (err) {
             console.log(err);
             if (!!err){
                 console.log('An error occured when creating Tables!!');
             } else {
                 console.log('Tables Successfully Created!');
             }
         });
}

var models = [
    'Customer',
    'Keyword',
    'Index',
    'Link',
    'Payment',
    'Promotion'
];

sequelize.models || (sequelize.models = {});

models.forEach(function (model) {
    sequelize.models[model] = sequelize.import(__dirname + '/models/' + model);
});

// 
syncTables(false);

module.exports = sequelize.models;

