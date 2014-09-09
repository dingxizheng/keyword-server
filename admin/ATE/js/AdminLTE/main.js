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
            .state('customer-edit', {
                url: '/customers/:customerId/action/:action',
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
        $httpProvider.interceptors.push(['$q', '$location', '$injector', '$rootScope',
            function($q, $location, $injector, $rootScope) {
                return {
                    'response': function(response) {
                        if (response.data.message) {
                            // console.log(response.data.message);
                            $rootScope.$broadcast('alertMsg', {
                                title: 'Message',
                                message: response.data.message,
                                class: 'info'
                            });
                        }
                        return response;
                    },
                    'responseError': function(rejection) {
                        var state = $injector.get('$state');
                        if (rejection.status === 401) {
                            state.go('login');
                            // show the error message on alert-view
                            $rootScope.$broadcast('alertMsg', {
                                title: 'Error',
                                message: rejection.data.message,
                                class: 'warning'
                            });

                        } else if (rejection.status === 404) {
                            state.go('notfound');
                        } else {
                            // show the error message when a server error occurs
                            $rootScope.$broadcast('alertMsg', {
                                title: 'Error',
                                message: rejection.data.message || rejection.data.error,
                                class: 'warning'
                            });

                        }
                        return $q.reject(rejection);
                    }
                };
            }
        ]);
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

    /**
     * alert controller
     * takes care all messages that from the server
     */
    app.controller('alertCtrl', function($scope, $timeout) {
        $scope.title = '';
        $scope.message = '';
        $scope.class = '';
        $scope.show = false;

        $scope.$on('alertMsg', function(event, data) {
            $scope.title = data.title;
            $scope.message = data.message;
            $scope.class = data.class;
            $scope.show = true;
            // dismiss the alert message after 5 seconds
            $timeout(function() {
                $scope.show = false;
            }, 5000);
        });

    });

    app.controller('customerCtrl', function($scope, $http, $state, $stateParams, $timeout) {

        $scope.customers = [];

        $scope.customer = {
            logo: '123.png'
        };

        $scope.editMode = false;

        $scope.getCustomers = function() {
            $http.get('/customers')
                .success(function(data, status, header) {
                    $scope.customers = data;
                    $timeout(function() {
                        $('#customers').dataTable({
                            "bPaginate": true,
                            "bLengthChange": false,
                            "bFilter": false,
                            "bSort": true,
                            "bInfo": true,
                            "bAutoWidth": true
                        });
                    }, 500);
                });
        };

        $scope.getCustomer = function(id) {
            $http.get('/customers/' + id)
                .success(function(data, status, header) {
                    $scope.customer = data;
                    $scope.customer.keywords = data.keywords.join(';');
                });
        };

        $scope.addCustomer = function(customer) {
            console.log(customer);
            $http.post('/customers/add', customer)
                .success(function(data, status, header) {
                    $state.go('customer');
                });
        };

        $scope.updateCustomer = function(customer) {
            $http.put('/customers/' + customer.id, customer)
                .success(function(data, status, header) {
                    $state.go('customer');
                });

        };

        if ($stateParams.customerId && $stateParams.action === 'edit') {
            $scope.getCustomer($stateParams.customerId);
            $scope.editMode = true;
        }

    });

    app.controller('keywordCtrl', function($scope, $http, $timeout) {

        $scope.keywords = [];

        $scope.getKeywords = function() {
            $http.get('/keywords')
                .success(function(data, status, header) {
                    $scope.keywords = data;
                    $timeout(function() {
                        $('#keywords').dataTable({
                            "bPaginate": true,
                            "bLengthChange": false,
                            "bFilter": false,
                            "bSort": true,
                            "bInfo": true,
                            "bAutoWidth": true
                        });
                    }, 500);
                });
        };


    });

    app.controller('uploadCtrl', function($scope, $http) {

        $scope.previewUrl = "";
        $scope.logoName = "";

        $scope.uploadFile = function(files) {

            var fd = new FormData();
            fd.append("image", files[0]);

            $http.post('/images/upload', fd, {
                withCredentials: true,
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity
            })
                .success(function(data, status, header) {
                    // $scope.previewUrl = data.croped;
                    $scope.logoName = data.name;
                    $scope.$parent.customer.logo = data.name;
                })
                .error(function(err) {
                    console.log(err);
                });

        };

    });



})();
