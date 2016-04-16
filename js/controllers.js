var employeeControllers = angular.module('employeeControllers',['ngMaterial','uiGmapgoogle-maps']);


// function for side nav bar view
employeeControllers.controller('AppCtrl', function($scope, $mdSidenav) {
            $scope.toggleSidenav = function(menuId) {
                $mdSidenav(menuId).toggle();
            };
        });

// function for about us view
employeeControllers.controller('AboutusCtrl', function($scope, $mdSidenav) {
            $scope.toggleSidenav = function(menuId) {
                $mdSidenav(menuId).toggle();
            };
        });



// Controller for dashboard view
employeeControllers.controller("DashBoardCtrl", ["$scope", "$cookies", "$routeParams", "$location", "WebService", "$mdDialog", "$mdMedia", "uiGmapIsReady", "$timeout",
    function($scope, $cookies, $routeParams, $location, WebService, $mdDialog, $mdMedia, uiGmapIsReady, $timeout) {
        var token = $cookies.get("token");
        WebService.dashboardData(token)
            .then(function (response) {
                $scope.books = response.data[0].books;
                $scope.messages = response.data[0].messages;
                //transforms the date to miliseconds so they can be sorted easier
                for (var i = 0; i < $scope.messages.length; i++) {
                    $scope.messages[i].date = new Date($scope.messages[i].date).getTime();
                }
                $scope.toDos = response.data[0].todo;
                $scope.userName = response.data[0].username;
                
                console.log($scope.toDos);
            })
            .catch (function () {
                $scope.error = "error getting data";
            });
        
        //function to logout user
        //simply remove cookies token
        $scope.logout = function () {
            $cookies.remove("token");
            
            $location.path("/login");
        };
        
        //function when user click Edit Button, display dialog box to allow editting entry.
        $scope.showEditDialog = function(id) {
            $scope.selectedId = id;
            console.log(id);
            $mdDialog.show({
                templateUrl: './partials/editTabDialog.html',
                scope: $scope,
                preserveScope: true,
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                controller: editController
            });
        };
        
        //function to show dialog box that allows user to create new entry
        $scope.showCreateDialog = function() {
            $mdDialog.show({
                templateUrl: './partials/createEntryDialog.html',
                parent: angular.element(document.body),
                scope: $scope,
                preserveScope: true,
                clickOutsideToClose:true,
                controller: createController
            });
        };
        
        //
        function createController ($scope, $mdDialog) {
            $scope.createToDoItem = function () {
                var date = new Date();
                var todoItem = {
                    'id': $scope.toDos.length + 1,
                    'status': $scope.status,
                    'priority': $scope.priority,
                    'date': date.toUTCString(),
                    'description': $scope.description
                };
                console.log($scope.toDos);
               
                WebService.createToDo($scope.userName, todoItem, $cookies.get("token"))
                    .then(function (response) {
                        $mdDialog.hide();
                        $scope.toDos.push(response.data.createdItem);
                        $scope.status = "";
                        $scope.priority = "";
                        $scope.description = "";
                    });
            };
        }
        
        function editController ($scope, $mdDialog) {
            //takes an object literal that has the updated properties inside of it
            //updates the backend then updates the scope object to reflect changes
            $scope.updateToDoItem = function (id) {
                var updatedToDo = {
                    'status': $scope.updateStatus,
                    'priority': $scope.updatePriority,
                    'description': $scope.updateDescription
                };
                
                WebService.updateToDo($scope.userName, id, $cookies.get("token"), updatedToDo);
                $mdDialog.hide();
                $scope.updateStatus = "";
                $scope.updatePriority = "";
                $scope.updateDescription = "";
                console.log("updated to do item");
                for (var i = 0; i < $scope.toDos.length; i++) {
                    if (id == $scope.toDos[i].id) {
                        //update object
                        $scope.toDos[i].status = updatedToDo.status;
                        $scope.toDos[i].priority = updatedToDo.priority;
                        $scope.toDos[i].description = updatedToDo.description;
                    }
                }
            };
        }
        
        $scope.deleteToDoItem = function (id) {
            WebService.deleteToDo($scope.userName, id, $cookies.get("token"));
            //removes the item from the client side
            for (var i = 0; i < $scope.toDos.length; i++) {
                if (id == $scope.toDos[i].id) {
                    $scope.toDos.splice(i, 1);
                }
            }
            $mdDialog.hide();
            //console.log($scope.toDos);
        };
        
        
        $scope.showUniversityDetails = function (universityId, name, address, city, state, zip, website, latitude, longitude) {
            //var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $scope.showMap = false;
            $scope.showMap = true;
            $mdDialog.show({
                templateUrl: './partials/universityDetail.html',
                scope: $scope,
                preserveScope: true,
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                //fullscreen: useFullScreen,
                locals: {
                    universityObj: {
                        'id': universityId,
                        'name': name,
                        'address': address,
                        'city': city,
                        'state': state,
                        'zip': zip,
                        'website': website,
                        'latitude': latitude,
                        'longitude': longitude
                    }
                },
                controller: universityDialogController
                
            });
            
            // uiGmapIsReady.promise().then(function (maps) {
            //     $scope.control.refresh();
            // });
            
            
        };
        
        function universityDialogController ($scope, universityObj) {
            var mapRef;
            
            var myLatLng = { latitude: universityObj.latitude, longitude: universityObj.longitude};
            
            $scope.showMap = true;
            $scope.map = { 
                center: myLatLng,
                zoom: 13, 
                refresh: true,
                events: {
                    function (map) {
                        $scope.$apply(function () {
                            mapRef = map;
                        });
                    }
                }
            };
            $scope.render = true;
            $scope.latitude = universityObj.latitude;
            $scope.longitude = universityObj.longitude;
            $scope.universityName = universityObj.name;
            $scope.universityId = universityObj.id;
            $scope.universityAddress = universityObj.address;
            $scope.universityState = universityObj.state;
            $scope.universityZip = universityObj.zip;
            $scope.universityCity = universityObj.city;
            $scope.universityWebsite = universityObj.website;
    
            $scope.showMap = false;
            $scope.showMap = true;
            
            window.setTimeout(function(){ google.maps.event.trigger(mapRef, 'resize'); 
            mapRef.setCenter(myLatLng); }, 100);
            // google.maps.event.addDomListener(window, "resize", function() {
            
            //     google.maps.event.trigger(mapRef, "resize");
            // });
            
           
        }
        
    }
]);


employeeControllers.controller("createCtrl", ["$scope", "$mdDialog", "WebService"], 
    function ($scope, $mdDialog, WebService) {
        $scope.createToDoItem = function () {
            var date = new Date();
            var todoItem = {
                'id': $scope.toDos.length + 1,
                'status': $scope.status,
                'priority': $scope.priority,
                'date': date.toUTCString(),
                'description': $scope.description
            };
            console.log($scope.toDos);
           
            WebService.createToDo($scope.userName, todoItem, $cookies.get("token"))
                .then(function (response) {
                    $scope.$apply(function () {
                        console.log("in function: ");
                        $scope.toDos.push(response.data.createdItem);
                        console.log($scope.toDos);
                    });
                });
        
            // console.log(newItem);
            // $scope.toDos.push(newItem);
            
            $mdDialog.hide();
            //refresh to do list to reflect changes
            
        };
        
        $scope.showCreateDialog = function() {
            $mdDialog.show({
                templateUrl: './partials/createEntryDialog.html',
                parent: angular.element(document.body),
                scope: $scope,
                preserveScope: true,
                clickOutsideToClose:true,
            });
        };
    }
);

employeeControllers.controller("LoginCtrl", ["$scope","$cookies", "WebService", "$location",
    function($scope, $cookies, WebService, $location) {
        $scope.displayClass = "visibility";
        if ($cookies.get("token") !== undefined) {
            console.log($cookies.get("token"));
            $location.path('/dashBoard');
        }
        else {
            $scope.login = function() {
                $scope.displayClass = "visibility";
                WebService.validateLogin($scope.userName, $scope.password)
                    .then(function (response) {
                        if (response.data.error) {
                            //inform user of invalid credentials
                            $scope.displayClass = "";
                            $scope.message = response.data.message;
                        }
                        else {
                            $cookies.put("token", response.data);
                            $location.path('/dashBoard');   
                        }
                        
                    });
            };
        }
    }    
]);

