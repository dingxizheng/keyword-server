(function () {

	// create the module and name it as 'app'
	var app = angular.module('gampAdmin', ['ngRoute']);

	// 
	app.factory('AuthService', function ($http) {

		var AuthService = {};

		AuthService.isAuthticated = false;

		AuthService.userName = '';

		AuthService.userId = '';

		AuthService.login = function (credentials) {
			return $http.post('/admin/login', credentials);
		};

		AuthService.logout = function () {
			return $http.get('/admin/logout');
		};

		AuthService.logedin = function () {
			return $http.get('/admin/logedin');
		};

		return AuthService;

	});

	// 
	app.factory('RouteService', function ($http) {

		var RouteService = {};

		RouteService.templates = {
			add_customer : 'views/customer.html',
			edit_customer: 'views/customer.html'
		};

		return RouteService;

	});

	// app.config('$locationProvider, $routeProvider', function ($locationProvider, $routeProvider) {

	// });

	app.controller('AuthCtrl', function ($scope, $http, AuthService) {

		$scope.logedin = AuthService.isAuthticated;

		$scope.credentials = {

			username: '',
			password: ''

		};

		$scope.authenticate = function (credentials) {
			AuthService.login(credentials)
				.success(function (data, status, header) {
					console.log(data);
					if (data.logedin){
						AuthService.isAuthticated = true;
						AuthService.userName = data.user.name;
						AuthService.userId = data.user.id;
					} else {
						AuthService.isAuthticated = false;
					}
					
				})
				.error(function (err) {
					console.log(err);
				});
		};

		$scope.logout = function () {};

		$scope.logedin = function () {
			AuthService.logedin()
				.success(function (data, status, header) {
					if (data.logedin){
						AuthService.isAuthticated = true;
						AuthService.userName = data.user.name;
						AuthService.userId = data.user.id;
					} else {
						AuthService.isAuthticated = false;
					}

				})
				.error(function (err) {

				});
		};

		$scope.$watch(
			function () { return AuthService.isAuthticated; }, 
			function (newVal, oldVal) {
				$scope.logedin = newVal;
			}, 
			true);

	});

	app.controller('CustomerCtrl', function ($scope, $http, $filter) {

		$scope.customers = [];

		$scope.getCustomers = function () {
			$http.get('../customers')
				 .success(function (data, status, header) {
				 	$scope.customers = data;
				 	console.log(data);
				 });
		}

	});


})();


