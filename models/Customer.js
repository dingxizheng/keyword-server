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

            logo: {
                type: DataType.STRING,
                allowNull: true,
                defaultValue: 'null'
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
                 */
                new: function(name, description, telephone, email, address, logo) {

                    return Customer.build({
                            name: name,
                            description: description,
                            telephone: telephone,
                            email: email,
                            address: address,
                            logo: logo
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

            instanceMethods: {

                /*
                 * set up keywords by passing an keyword names list
                 * @param keywords
                 *        keywords list : ['one', 'two', 'three']
                 * @return
                 *        an promise
                 *
                 */
                setKeywordsArray: function(keywords) {
                    var that = this;
                    var Q = require('q');
                    var Keyword = sequelize.models.Keyword;
                    var promiseArr = [];
                    keywords.forEach(function(kw) {
                        promiseArr.push(Keyword.getByName(kw));
                    });

                    return Q.all(promiseArr).then(function(results) {
                        return that.setKeywords(results);
                    });
                },


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
                 */
                updateFields: function(name, description, telephone, email, address, logo) {
                    return this.updateAttributes({
                        name: name,
                        description: description,
                        telephone: telephone,
                        email: email,
                        address: address,
                        logo: logo
                    });
                }

            }

        });

    return Customer;

};
