(function () {
    var employeeApp = angular.module('employeeApp', ['ngCookies', 'ngRoute','employeeControllers']);
    employeeApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
        .when("/login", {
            templateUrl: "partials/login.html",
            controller: "LoginCtrl"
        })
        .when("/dashBoard", {
            templateUrl: "partials/dashboard.html",
            controller: "DashBoardCtrl"
        })
        .when("/aboutUs", {
            templateUrl: "partials/aboutus.html"
        })
        //otherwise, display login page
        .otherwise({
            redirectTo: '/login'
        });
        
    }
    ]);
    
    employeeApp.config(function($mdThemingProvider) {
            $mdThemingProvider
                .theme('default')
                .primaryPalette('blue')
                .accentPalette('pink');
        });
    
    employeeApp.config(function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyBqOdjb7qnFyMId4FoLcNDIRnvRbWzYtNA',
            v: '3.17', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization'
        });
    });
    
    employeeApp.factory('WebService', function ($http, $q) {
        return {
            validateLogin: function (userName, password) {
               
                return $http({
                    method: 'post',
                    url: "http://web3a2-61805.onmodulus.net/api/employees/login/" + userName,
                    data: {
                        'password': password
                    }
                });
            },
            dashboardData: function (token) {
                return $http ({
                   method: 'get',
                   url: 'http://web3a2-61805.onmodulus.net/api/employees/' + token
                });
            },
            getToDo: function (userName, token) {
                return $http ({
                    method: 'get',
                    url: 'http://web3a2-61805.onmodulus.net/api/employees/' + userName + "/todo/" + token
                });
            },
            //done testing
            //todoItem is an object passed into the function
            updateToDo: function (userName, todoID, token, todoItem) {
                return $http ({
                   method: 'put',
                   url: 'http://web3a2-61805.onmodulus.net/api/employees/' + userName + '/todo/' + todoID,
                   data: {
                       'token': token,
                       'status': todoItem.status,
                       'priority': todoItem.priority,
                       'description': todoItem.description
                    }
                });
            },
            //done testing
            //todoItem is an object passed into the function
            createToDo: function (userName, todoItem, token) {
                return $http ({
                    method: 'post',
                    url: 'http://web3a2-61805.onmodulus.net/api/employees/' + userName + '/todo/',
                    data: {
                        'token': token,
                        'id': todoItem.id,
                        'status': todoItem.status,
                        'priority': todoItem.priority,
                        'date': todoItem.date,
                        'description': todoItem.description
                    }
                });
            },
            //done testing
            deleteToDo: function (userName, todoID, token) {
                console.log(token);
                return $http ({
                    method: 'delete',
                    url: 'http://web3a2-61805.onmodulus.net/api/employees/' + userName + '/todo/' + todoID + "/" + token
                    // data: {
                    //     'token': token
                    // }
                });
            }
        };
    });
    
}());