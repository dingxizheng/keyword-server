#!/usr/bin/env node

var express = require('express');
var router = express.Router();
var DB = require('../db');
var Customer = DB['Customer'];


// get customer list
router.get('/',
    function(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            var msg = {
                logedin: 0,
                message: 'Please log in.'
            }
            res.send(msg);
        }
    },
    function(req, res) {
        Customer.all()
            .success(function(customers) {

                res.send(customers.map(function(customer) {
                    return customer.dataValues;
                }))

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
    console.log(req.body.name)
    Customer.new(
       req.params.name,
       req.params.description,
       req.params.telephone,
       req.params.email,
       req.params.address
    ).success(function (customer) {
        res.send(customer.dataValues);
    }) 
    .error(function(err){
        next(err);
    });

})


module.exports = router;
