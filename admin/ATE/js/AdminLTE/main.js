(function() {
    "use strict";

    var app = angular.module('adminApp', ['ui.router']);

    app.config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/customers");

        $stateProvider
            .state('login', {
                url: '/login',
                views: {
                    'main-view': {
                        templateUrl: '/admin/views/login.html'
                    }
                }
            })
            .state('customer', {
                url: '/customers',
                views: {
                    'main-view': {
                        templateUrl: '/admin/views/customer.html',
                        controller: 'customerCtrl'
                    }
                }
            })
            .state('customer-add', {
                url: '/customers/add',
                views: {
                    'main-view': {
                        templateUrl: '/admin/views/add_customer.html',
                        controller: 'customerCtrl'
                    }
                }
            })
            .state('keyword', {
                url: '/keywords', 
                views: {
                    'main-view': {
                        templateUrl: '/admin/views/keyword.html',
                        controller: 'keywordCtrl'
                    }
                }
            })
    });

    // 
    app.factory('AuthService', function($http) {

        var AuthService = {};

        AuthService.isAuthticated = false;

        AuthService.userName = '';

        AuthService.userId = '';

        AuthService.login = function(credentials) {
            return $http.post('/admin/login', credentials);
        };

        AuthService.logout = function() {
            return $http.get('/admin/logout');
        };

        AuthService.logedin = function() {
            return $http.get('/admin/logedin');
        };

        return AuthService;

    });


    app.config(function($httpProvider) {
        $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
            return {
                'response': function(response) {
                    return response;
                },
                'responseError': function(rejection) {
                    if (rejection.status === 401) {
                        $location.path('/login');
                    } else if (rejection.status === 404) {
                        $location.path('/notfound');
                    }
                    return $q.reject(rejection);
                }
            };
        }]);
    });

    app.controller('AuthCtrl', function($scope, $http, AuthService, $state) {

        $scope.logedin = AuthService.isAuthticated;

        $scope.credentials = {

            username: '',
            password: ''

        };

        $scope.authenticate = function(credentials) {
            AuthService.login(credentials)
                .success(function(data, status, header) {
                    if (data.logedin) {
                        AuthService.isAuthticated = true;
                        AuthService.userName = data.user.name;
                        AuthService.userId = data.user.id;
                        $state.go('customer');
                    } else {
                        AuthService.isAuthticated = false;
                    }

                })
                .error(function(err) {
                    console.log(err);
                });
        };

        $scope.logout = function() {
            AuthService.logout();
        };

        $scope.logedin = function() {
            AuthService.logedin()
                .success(function(data, status, header) {
                    if (data.logedin) {
                        AuthService.isAuthticated = true;
                        AuthService.userName = data.user.name;
                        AuthService.userId = data.user.id;
                        console.log(data);
                    } else {
                        AuthService.isAuthticated = false;
                    }

                })
                .error(function(err) {
                    // $state.go('error');
                });
        };

        $scope.$watch(
            function() {
                return AuthService.isAuthticated;
            },
            function(newVal, oldVal) {
                $scope.logedin = newVal;
            },
            true);

    });

    app.controller('customerCtrl', function($scope, $http) {

        $scope.customers = [];

        $scope.customer = {};

        $scope.getCustomers = function() {
            $http.get('/customers')
                .success(function(data, status, header) {
                    $scope.customers = data;
                    console.log(data);
                });
        };

        $scope.addCustomer = function(customer) {
            console.log(customer);
            $http.post('/customers/add', customer)
                .success(function(data, status, header) {

                });
        };

    });

    app.controller('keywordCtrl', function ($scope, $http) {
        
        $scope.keywords = [];

        $scope.getKeywords = function() {
            $http.get('/keywords')
                .success(function(data, status, header) {
                    $scope.keywords = data;
                    console.log(data);
                });
        };


    });



})();
