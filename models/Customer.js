#!/usr/bin/env node


module.exports = function(sequelize, DataType) {

    var Customer = sequelize.define('Customer', {

            name: {
                type: DataType.STRING,
                allowNull: false,
                unique: true
            },

            description: {
                type: DataType.TEXT,
                defaultValue: 'No description'
            },

            telephone: {
                type: DataType.STRING,
                allowNull: false,
                validate: {
                    is: ['^\\+?([0-9]{2})\\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$', 'i']
                }
            },

            email: {
                type: DataType.STRING,
                allowNull: false,
                validate: {
                    isEmail: true
                }
            },

            address: {
                type: DataType.TEXT,
                allowNull: true,
                defaultValue: 'NO adderss'
            }
        },

        // defined methods 
        {

            classMethods: {

                /*
                 * crated a new Customer entry
                 * @param name:
                 *       customer name
                 * @param decription:
                 *       decription of customer
                 * @param telephone:
                 *       telephone number
                 * @param email:
                 *       email address
                 * @param callback
                 *       calllback function
                 */
                new: function(name, description, telephone, email, address) {

                    return Customer.build({
                            name: name,
                            description: description,
                            telephone: telephone,
                            email: email,
                            address: address
                        })
                        .save();

                },

                findByName: function(name) {
                    return Customer.find({
                        where: {
                            name: name
                        }
                    });
                },

                setLink: function(type, link) {},

                getAllCustomerData: function() {

                }

            },

            instanceMethods: {}

        });

    return Customer;

};
