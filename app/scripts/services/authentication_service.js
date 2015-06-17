'use strict';

var booklibServices = angular.module('booklibServices');

booklibServices.service('AuthenticationService', ['$log','localStorageService','$base64','$q', 'API_URL',
  function ($log, localStorage, $base64, $q, API_URL) {

    var LS_USERNAME = 'username';
    var LS_AUTHENTICATION = 'auth';
    var LOGIN_URL = API_URL + '/account/login';

    function clearCredentials() {
      localStorage.remove(LS_AUTHENTICATION);
      localStorage.remove(LS_USERNAME);
    }

    function setCredentials(username, apikey) {
      localStorage.set(LS_USERNAME, username);
      localStorage.set(LS_AUTHENTICATION, 'Basic ' + $base64.encode(apikey + ':'));
    }

    this.requiresAuthentication = function(url) {
      // Check that URL starts with API_URL
      return url.lastIndexOf(API_URL, 0) === 0;
    };

    this.getUsername = function() {
      return localStorage.get(LS_USERNAME, username);
    };

    this.getAuth = function() {
      return localStorage.get(LS_AUTHENTICATION);
    };

    this.isAuthenticated = function() {
      var authValue = this.getAuth();
      return typeof(authValue) !== 'undefined' && authValue !== null;
    };

    this.performLogin = function(username, password) {
      var deferred = $q.defer();
      var promise = deferred.promise;
      promise.then(function (user) {
        setCredentials(user.username, user.api_key);
      }, function () {
        clearCredentials();
      });

      // don't use $http to avoid circular reference, so directly use XMLHttpRequest
      var request = new XMLHttpRequest();
      request.open('POST', LOGIN_URL, true);
      request.setRequestHeader('Accept', 'application/json');
      request.setRequestHeader('Content-Type', 'application/json');
      request.onload = function () {
        if (this.status === 200) { // Login OK
          deferred.resolve(JSON.parse(this.responseText));
        } else {
          if (this.status === 401) { // Login failed
            deferred.reject(JSON.parse(this.responseText).message);
          } else {
            $log.error('Failed to authenticate: ' + JSON.stringify(this));
            deferred.reject('Unexpected server error: [' + this.status + "] " + this.statusText);
          }
        }
      };
      request.onerror = function(e) {
        if (e.eventPhase === 2) {
          $log.error('Failed to reach server at: ' + loginUrl);
          deferred.reject('Failed to reach server at: ' + loginUrl);
        }
      };
      var body = {'login':username,'password':password};
      request.send(JSON.stringify(body));

      return promise;
    };
    this.logout = function() {
      clearCredentials();
    }
  }]);

//HTTP Interceptor that adds Basic-Auth 'Authorization' header to all requests if the user is authenticated.
booklibServices.factory('BasicAuthenticationInterceptor', ['AuthenticationService','$log',
  function (AuthenticationService,$log) {
    var resp = {};
    resp.request = function(config) {
      if (AuthenticationService.requiresAuthentication(config.url)) {
        if (AuthenticationService.isAuthenticated()) {
          $log.debug('BasicAuthenticationInterceptor caught:' + JSON.stringify(config));
          $log.debug('Authorization: ' + AuthenticationService.getAuth());
          config.headers.Authorization = AuthenticationService.getAuth();
        }
      }
      return config;
    };
    return resp;
  }
]);

// intercepts all $http requests to localhost by adding Basic Auth header
booklibServices.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('BasicAuthenticationInterceptor');
}]);
