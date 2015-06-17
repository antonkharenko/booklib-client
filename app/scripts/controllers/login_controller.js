'use strict';

var booklibControllers = angular.module('booklibControllers');

booklibControllers.controller('LoginCtrl', ['$scope', 'AccountService', '$location',
  function ($scope, AccountService, $location) {
    $scope.loginRequest = {}; // e.g. {username:'test',password:'password'}
    $scope.error = '';
    $scope.login = function () {
      AccountService.login($scope.loginRequest)
        .success(function(user) {
          $scope.error = '';
          $location.path('/dashboard/' + user.username);
        })
        .error(function(errReason) {
          $scope.error = errReason;
        });
    };
  }]
);
