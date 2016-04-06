var employeeControllers = angular.module('employeeControllers',[]);

var employee_serviceURL = 'https://web3-assignment2-nobuhumi.c9users.io/api/employees/';

// Controller for employee list view
employeeControllers.controller('EmployeeListCtrl', ['$scope', '$http',
    function($scope,$http) {
   
    $http.get(employee_serviceURL)
        .then(function (response) {
            $scope.books = response.data;
        });
    }
]);

// Controller for single employee detail view
employeeControllers.controller('EmployeeDetailCtrl', ['$scope', '$routeParams', '$http',
    function($scope,$routeParams,$http) {
    $scope.isbn = $routeParams.isbn;
    
    $http.get(employee_serviceURL + $routeParams.isbn)
        .then(function (response) {
            $scope.book = response.data[0];
        });
    }
]);

employeeControllers.controller("LoginCtrl", ["$scope","$cookies", "WebService",
    function($scope, $cookies, WebService) {
        
        $scope.credentials = "hello!";
        
        $scope.login = function() {
            
            //$("#results").text("in progress");
            
            WebService.validateLogin($scope.userName, $scope.password)
                .then(function (response) {
                  //$("#results").text("success"); 
                  $scope.credentials = $cookies.getAll();
                  console.log(response.data);
                })
                .catch(function () {
                    $scope.error = "error getting data";
                    
                    //console.log(error);
                });
        };
    }    
]);

// employeeControllers.controller('LoginCtrl', ['$scope', 'User', function($scope, User) {
//     $scope.username = "viewer";
//     $scope.password = "viewer";

//     $scope.login = function(event) {
//         event.preventDefault();

//         User.login($scope.username ,$scope.password)
//             .then(function(response) {
//                 $scope.status = response.status;
//                 $scope.data = response.data;
//                 alert(JSON.stringify({data: response.data}));
//         }, function (response) { 
//                 $scope.data = response.data || "Request failed";
//                 $scope.status = response.status;
//                 alert( "failure message: " + JSON.stringify({data: response.data}));
//         })
//     };
// }]);
