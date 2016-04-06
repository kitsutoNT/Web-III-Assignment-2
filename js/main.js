(function () {
    var employeeApp = angular.module('employeeApp', ['ngCookies', 'ngRoute','employeeControllers']);
    employeeApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
        //all employees listed
        .when("/employees", {
            templateUrl: "partials/employeeList",
            controller: "EmployeeListCtrl"
            
        })
        //one specific employee with detail
        .when("/employees/:id", {
            templateUrl: "partials/employeeDetail.html",
            controller: "EmployeeDetailCtrl"
            
        })
        .when("/login", {
            templateUrl: "partials/login.html",
            controller: "LoginCtrl"
        })
        .when("", {
            templateUrl: "partials/dashBoard.html",
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
            }
        };
    });
    
    // employeeApp.factory("User", ['$http', function($http) {
    //     return {
    //         login: function(username, password) {
    //             var data = {username: username, password: password};
    //             console.log(JSON.stringify(data));
    //             return $http({
    //                 method: 'get',
    //                 url: "https://web3-assignment2-nobuhumi.c9users.io/api/employees/login/" + username
    //                     + "&" + password,
    //                 data: JSON.stringify(data),
    //                 headers: {'Content-Type': 'application/json'}
    //             })
    //         }
    //     }
    // }]);
    
}());