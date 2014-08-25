#!/usr/bin/env node

var express = require('express');
var router = express.Router();
var DB = require('../db');
var Customer = DB['Customer'];
var Keyword  = DB['Keyword'];
var Q = require('q');


// get customer list
router.get('/', function(req, res, next) {

        // this request should be authorized 
        req.checkLogin();

        Customer.all()
            .success(function(customers) {
                var promiseArr = [];
                customers.forEach(function(customer) {
                    promiseArr.push(customer.getKeywords());
                });

                Q.all(promiseArr).then(function(results){
                     customers.forEach(function(customer, i){
                        customer.dataValues.keywords = results[i].map(function(keyword){ return keyword.name });
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

                    customer.dataValues.keywords = words.map(function(word){ return word.name });
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


router.post('/add', function(req, res, next) {

    req.checkLogin();

    Customer.new(

       req.body.name,
       req.body.description,
       req.body.telephone,
       req.body.email,
       req.body.address,
       req.body.logo

    ).success(function (customer) {

        var promiseArr = [];
        req.body.keywords.split(';').forEach(function(kw){
            promiseArr.push(Keyword.getByName(kw));
        });

        Q.all(promiseArr).then(function(results){
            customer.setKeywords(results).success(function(){
                customer.dataValues.keywords = req.body.keywords.split(';');
                res.send(customer.dataValues);
            });
        });
        
    }) 
    .error(function(err){
        next(err);
    });

})


module.exports = router;
