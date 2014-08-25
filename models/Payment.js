#!/usr/bin/env node

module.exports = function(sequelize, DataType) {

    var Payment = sequelize.define('Payment', {

        expireAt: {
            type: DataType.DATE,
            allowNull: false
        }

    }, {

        classMethods: {

            new: function(expireAt) {

                return Payment.build({

                    expireAt: expireAt

                }).save();

            },

            delete: function(payment) {

                return payment.delete();

            },

            getValidPayments: function() {}

        }

    });

    var Customer = sequelize.models.Customer;
    Customer.hasMany(Payment, {
        as: 'Payments',
        foreignKey: 'CustomerId',
        useJunctionTable: false
    });
    Payment.belongsTo(Customer, {
        as: 'Customer',
        foreignKey: 'CustomerId'
    });

    return Payment;

};
