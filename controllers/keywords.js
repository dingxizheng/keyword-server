#!/usr/bin/env node

var express = require('express');
var router = express.Router();
var DB = require('../db');
var Q = require('q');
var Keyword = DB['Keyword'];


router.get('/', function(req, res, next) {

    Keyword.all().success(function(keywords) {

        var promiseArr = [];

        keywords.forEach(function(keyword) {
            var promise = keyword.getCustomers();
            promiseArr.push(promise);
        });

        Q.all(promiseArr).then(function (results) {
            res.send(keywords.map(function(keyword, i){
                var customers = results[i];
                keyword.dataValues.customers = customers.map(function(c){  return { id:c.id, name:c.name }; });
                return keyword.dataValues;
            }));
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
