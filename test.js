#!/usr/bin/env node

var DB = require('./db');
var Customer = DB['Customer'];
var Keyword = DB['Keyword'];
var Link = DB['Link'];
var Payment = DB['Payment'];
var Promotion = DB['Promotion'];
var Q = require('q');

var fs = require('fs');
var gm = require('gm').subClass({
    imageMagick: true
});


// console.log(DB);

// Customer.new(
//     'Leon\'s', 
//     'This is Leon\'s Business', 
//     '8076319945', 
//     'dingxizheng@gmail.com'
// )
// .success(function (Customer) {
//     console.log(Customer);
// })
// .error(function (err) {
//     console.log(err);
// });

// Keyword.new(
//     'toyota',
//     'this is a keyword'
// )
// .success(function (keyword) {
//     console.log(keyword);
// })
// .error(function (err) {
//     console.log(err);
// });

// Customer.findAll().success(function(customers){
//   // customers.forEach(function (customer) {
//   //     console.log(customer.name);
//   // });

// 	// console.log(customers[2].name);

// 	// Promotion.new(Arjun, 'Buy one get', new Date());

// 	// // Payment.new(new Date())
// 	// // 	   .success(function (payment) {

// 	// // 	   		Arjun.addPayment(payment)
// 	// // 	   			  .success(function () {
// 	// // 	   			  		console.log('shit...');
// 	// // 	   			  });

// 	// // 	   });

// });

// Customer.findAll().success(function(customers){

// 	customers.map(function (customer) {

// 		customer.hasPayment()
// 				.success(function(result) {

// 					if (result)
// 						console.log(customer.name)

// 				});

// 	});

// });


// Payment.all().success(function(payments){

// 	payments.forEach(function (payment) {

// 		payment.getCustomer().success(function (customer) {
// 			console.log(customer.name);
// 		});

// 		// console.log(payment);

// 	});

// });



// Keyword.all().success(function (words) {
//     words.forEach(function (word) {

//     	word.getCustomers()
//     		.success(function (cs) {

//     			var name = cs.map(function (c) { return c.name; });

//     			console.log(word.name + '  -->  ' + name.join(' '));

//     		});

//     });
// });

// Customer.new(

//    'dingxizheng',
//    'This is dingxizheng\'s Business',
//    '8076319942',
//    'dingxizheng@gmail.com',
//    '16 Morbank Dr. Scarbough, M1V2M2',
//    '12355.jpg'

// ).success(function (customer) {

//     var promiseArr = [];
//     'key;word;one;two;three'.split(';').forEach(function(kw){
//         promiseArr.push(Keyword.getByName(kw));
//     });
    
//     Q.all(promiseArr).then(function(results){
//         customer.setKeywords(results).success(function(){
//             // res.send(customer.dataValues);
//         });
//     });
    
// });

// Link.new('facebook', 'wwww.facebook.com/dingxizheng')
// 	.success(function (link) {
// 		console.log(link);

// 		Customer.findByName('Eric\'s').success(function (customer) {
// 			console.log(customer);

// 			customer.addLink(link).complete(function (err) {
// 				console.log(err);
// 			});

// 		})

// 	});


// Db.sync();

