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
        //otherwise, display login page
        .otherwise({
            redirectTo: '/login'
        });
        
    }
    ]);
    
    employeeApp.factory('WebService', function ($http, $q) {
        return {
            validateLogin: function (userName, password) {
               
                return $http({
                    method: 'post',
                    url: "https://web3-assignment2-nobuhumi.c9users.io/api/employees/login/" + userName,
                    data: {
                        'password': password
                    }
                });
            },
            dashboardData: function (token) {
                return $http ({
                   method: 'get',
                   url: 'https://web3-assignment2-nobuhumi.c9users.io/api/employees/' + token
                });
            },
            updateToDo: function () {
                
            },
            createToDo: function () {
                
            },
            deleteToDo: function () {
                
            }
        };
    });
    
}());