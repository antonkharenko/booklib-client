'use strict';

var booklibControllers = angular.module('booklibControllers');

booklibControllers.controller('UsermenuCtrl', ['$scope', '$log', '$location', 'AccountService',
  function ($scope, $log, $location, AccountService) {
    $scope.user = AccountService.getUser();

    $scope.logout = function () {
      AccountService.logout();
    };
  }]
);

