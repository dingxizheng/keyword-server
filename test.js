#!/usr/bin/env node

var DB        = require('./db');
var Customer  = DB['Customer'];
var Keyword   = DB['Keyword'];
var Link      = DB['Link'];
var Payment   = DB['Payment'];
var Promotion = DB['Promotion'];

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

Payment.all().success(function(payments){

	payments.forEach(function (payment) {

		payment.getCustomer().success(function (customer) {
			console.log(customer.name);
		});

		// console.log(payment);

	});

});



// Keyword.all().success(function (words) {
//     words.forEach(function (word) {
        
//     	word.getCustomers()
//     		.success(function (cs) {

//     			var name = cs.map(function (c) { return c.name; });

//     			console.log(word.name + '  -->  ' + name.join(' '));

//     		});

//     });
// });

// Keyword.findByName('nike')
//       .success(function (word) {
           
//           word.getCustomers()
//               .success(function (customers) {


                   
//                   // console.log(customers[0].dataValues);
                   
//               });
           
//         });

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

