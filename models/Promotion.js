#!/usr/bin/env node

module.exports =  function (sequelize, DataType) {

    var Promotion = sequelize.define('Promotion', {

	    expireAt: {
	    	type: DataType.DATE,
	    	allowNull: false
	    },

	    text: { type: DataType.STRING },

	    location: { type: DataType.STRING }
      
    }, {

        classMethods: {

            new: function(customer, text, expireAt){

                Promotion.build({
                    expireAt: expireAt,
                    text: text
                }).save()
                  .success(function (promotion) {

                  	  customer.addPromotion(promotion)
                  	  		  .success(function () {
                  	  		  	 console.log('promotion added successfully.');
                  	  		  });

                  });

            }

        }

    });

    var Customer = sequelize.models.Customer;
    Customer.hasMany(Promotion, {as: 'Promotions'});

    return Promotion;

};

