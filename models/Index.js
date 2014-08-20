#!/usr/bin/env node


module.exports = function (sequelize, DataType) {

	// Table of indexes
	var Index = sequelize.define('Index', {
	    
	    ispaid: { type: DataType.BOOLEAN, defaultValue: false }
	    
	}, 
	{
		tableName: 'Indexes'
	});

	var Customer = sequelize.models.Customer;
	var Keyword  = sequelize.models.Keyword;

	Customer.hasMany(Keyword, { through: Index });
	Keyword.hasMany(Customer, { through: Index });

	return Index;

};