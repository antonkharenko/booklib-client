'use strict';

var booklibControllers = angular.module('booklibControllers');

booklibControllers.controller('DashboardCtrl', ['$scope', '$log', 'AccountService',
    function ($scope, $log, AccountService) {
      $log.debug('Show dashboard for: ' + JSON.stringify(AccountService.getUser()));

      $scope.user = AccountService.getUser();
      $scope.username = $scope.user.username;

      $scope.searchBook = {};
    }
]);

