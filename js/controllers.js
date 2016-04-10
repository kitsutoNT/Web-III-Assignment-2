var employeeControllers = angular.module('employeeControllers',[]);

var employee_serviceURL = 'https://web3-assignment2-nobuhumi.c9users.io/api/employees/';


// Controller for dashboard view
employeeControllers.controller("DashBoardCtrl", ["$scope", "$cookies", "$routeParams", "$location", "WebService", 
    function($scope, $cookies, $routeParams, $location, WebService) {
        var token = $cookies.get("token");
        WebService.dashboardData(token)
            .then(function (response) {
                $scope.books = response.data[0].books;
                $scope.messages = response.data[0].messages;
                $scope.toDos = response.data[0].todo;
            })
            .catch (function () {
                $scope.error = "error getting data";
            });
            
        $scope.logout = function () {
            $cookies.remove("token");
            
            $location.path("/login");
        };
    }
]);

employeeControllers.controller("LoginCtrl", ["$scope","$cookies", "WebService", "$location",
    function($scope, $cookies, WebService, $location) {
        
        if ($cookies.get("token") !== undefined) {
            console.log($cookies.get("token"));
            $location.path('/dashBoard');
        }
        else {
            $scope.login = function() {
                
                WebService.validateLogin($scope.userName, $scope.password)
                    .then(function (response) {
                      $scope.credentials = response;
                      $cookies.put("token", response.data);
                      
                    //   var token = $cookies.get("token");
                    //   console.log("token is: " + token);
                      //$cookies.remove('token');
                      //console.log("token is:" + $cookies.get("token"));
                      $location.path('/dashBoard');
                    })
                    .catch(function () {
                        $scope.error = "error getting data";
                        
                        //console.log(error);
                    });
            };
        }
    }    
]);

