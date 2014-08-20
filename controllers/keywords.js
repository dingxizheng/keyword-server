#!/usr/bin/env node

var express = require('express');
var router = express.Router();
var DB = require('../db');
var Keyword = DB['Keyword'];


router.get('/', function(req, res, next) {

    Keyword.all().success(function(keywords) {

        var counter = keywords.length;

        keywords.forEach(function(keyword) {
            // console.log(keyword.name);
            keyword.getCustomers().success(function(customers) {
                console.log(customers.length);
                // customers.map(function(cus) {
                //     return cus.name
                // });
                // keyword.dataValues.customers = customers;
                // counter--;
                // if (counter === 0) {
                //     res.send(keywords.map(function(kw) {
                //         return kw.dataValues;
                //     }));
                // }
            });
        });

    });
});


router.get('/:keyword', function(req, res, next) {

    console.log(req.params.keyword);
    // res.send("doog");
    Keyword.findByName(req.params.keyword)
        .success(function(keyword) {

            if (keyword) {
                keyword.getCustomers()
                    .success(function(customers) {

                        res.send(customers.map(function(customer) {
                            return customer.dataValues
                        }));

                    });
            } else {
                res.send([{
                    name: 'No',
                    1: 'No'
                }]);
            }

        })
        .error(function(err) {
            next(err);
        })

});


module.exports = router;