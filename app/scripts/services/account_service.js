'use strict';

var booklibServices = angular.module('booklibServices');

/**
 * Account service provides API to manage user.
 */
booklibServices.service('AccountService', ['$http', '$log', '$location', 'AuthenticationService', 'BooklibStorage', 'API_URL',
  function ($http, $log, $location, AuthenticationService, BooklibStorage, API_URL) {

    /**
     * Login user by given login request.
     */
    this.login = function (loginRequest) {
      $log.debug('Send login request: ' + loginRequest);
      var promise = AuthenticationService.performLogin(loginRequest.login, loginRequest.password);
      promise.success = function (fn) {
        promise.then(function (resp) {
          $log.debug('Login successful: ' + resp);
          BooklibStorage.setUser(resp);
          fn(resp);
        });
        return promise;
      };
      promise.error = function (fn) {
        promise.then(null, function (resp) {
          $log.debug('Login failed: ' + resp);
          fn(resp);
        });
        return promise;
      };
      return promise;
    };

    /**
     * Sign up user by given login request.
     */
    this.signUp = function (signUpRequest) {
      $log.debug('Send sign up request: ' + signUpRequest);
      var httpResp = $http.post(API_URL + '/account/signup', signUpRequest);
      var resp = {};
      resp.success = function (fn) {
        httpResp.success(function (loginResponse, status, headers, config) {
          $log.debug('Sign up successful: ' + loginResponse);
          fn(loginResponse);
        });
        return resp;
      };
      resp.error = function (fn) {
        httpResp.error(function (loginResponse, status, headers, config) {
          var msg;
          if (loginResponse.message) {
            msg = loginResponse.message;
          } else if (loginResponse.errors) {
            msg = loginResponse.errors.join('<br/>');
          } else {
            msg = 'Failed to signup user. Please try again later';
          }
          $log.debug('Sign up failed: ' + msg);
          fn(msg);
        });
        return resp;
      };
      return resp;
    };

    /**
     * Log out current user. Returns void.
     */
    this.logout = function () {
      $log.debug('Log out user');
      var httpResp = $http.post(API_URL + '/account/logout');
      httpResp.success(function (userResponse, status, headers, config) {
        $log.debug('Log out successful');
        AuthenticationService.logout();
        BooklibStorage.clear();
        $location.path('/login');
      });
      httpResp.error(function (userResponse, status, headers, config) {
        $log.error('Log out failed: ' + userResponse);
        AuthenticationService.logout();
        BooklibStorage.clear();
        $location.path('/login');
      });
    };

    /**
     * Returns currently logged in user.
     */
    this.getUser = function() {
      return BooklibStorage.getUser();
    }
  }
]);
