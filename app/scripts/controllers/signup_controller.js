'use strict';

var booklibControllers = angular.module('booklibControllers');

booklibControllers.controller('SignUpCtrl', ['$scope', 'AccountService', '$log', '$location',
  function ($scope, AccountService, $log, $location) {
    $scope.signUpRequest = {}; // e.g. {username:'test10',first_name:'first_name', last_name:'last_name',email:'e@mail.com',password:'password'}
    $scope.error = '';
    $scope.signUp = function () {
      AccountService.signUp($scope.signUpRequest)
        .success(function(signUpResponse) {
          $scope.error = '';
          $location.path('/dashboard/' + signUpResponse.username);
        })
        .error(function(errReason) {
          $scope.error = errReason;
        });
    };
  }
]);
