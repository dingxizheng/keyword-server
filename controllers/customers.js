#!/usr/bin/env node

var express = require('express');
var router = express.Router();
var DB = require('../db');
var Customer = DB['Customer'];
var Keyword = DB['Keyword'];
var Q = require('q');


// get customer list
router.get('/', function(req, res, next) {

    // this request should be authorized 
    if(!req.checkLogin()) return;

    Customer.all()
        .success(function(customers) {
            var promiseArr = [];
            customers.forEach(function(customer) {
                promiseArr.push(customer.getKeywords());
            });

            Q.all(promiseArr).then(function(results) {
                customers.forEach(function(customer, i) {
                    customer.dataValues.keywords = results[i].map(function(keyword) {
                        return keyword.name
                    });
                });
                res.send(customers);
            });

        });
});


router.get('/:customerId(\\d+)', function(req, res, next) {

    Customer.find(req.params.customerId)
        .success(function(customer) {

            customer.getKeywords()
                .success(function(words) {

                    customer.dataValues.keywords = words.map(function(word) {
                        return word.name
                    });
                    res.send(customer.dataValues);

                });

        });

});




router.get('/:customer', function(req, res, next) {

    Customer.findByName(req.params.customer)
        .success(function(customer) {

            customer.getKeywords()
                .success(function(words) {

                    res.send(words.map(function(word) {
                        return word.dataValues;
                    }));

                });

        });

});


router.put('/:customerId', function(req, res, next) {

    if(!req.checkLogin()) return;

    console.log('waht', req.params['customerId']);

    Customer.find(req.params['customerId']).success(function(customer) {

        customer.updateFields(

            req.body.name,
            req.body.description,
            req.body.telephone,
            req.body.email,
            req.body.address,
            req.body.logo

        ).success(function(cs) {

            cs.setKeywordsArray(req.body.keywords.split(';')).then(function(results) {
                console.log(results.success);
                cs.dataValues.keywords = req.body.keywords;
                res.send(cs.dataValues);
            });

        });

    });

});


router.post('/add', function(req, res, next) {

    if(!req.checkLogin()) return;

    Customer.new(

        req.body.name,
        req.body.description,
        req.body.telephone,
        req.body.email,
        req.body.address,
        req.body.logo

    ).success(function(customer) {

        customer.setKeywordsArray(req.body.keywords.split(';')).then(function(results) {
            customer.dataValues.keywords = req.body.keywords;
            res.send(customer.dataValues);
        });

        customer.dataValues.keywords = req.body.keywords;
        res.send(customer.dataValues);

    })
        .error(function(err) {
            next(err);
        });

})


module.exports = router;
