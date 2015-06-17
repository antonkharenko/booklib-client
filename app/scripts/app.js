'use strict';

angular.module('booklibServices', ['ngResource']);
angular.module('booklibControllers', []);
angular.module('booklibDirectives', []);

var booklibApp = angular.module('booklibApp', [
  'booklibServices',
  'booklibControllers',
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'ui.bootstrap',
  'base64',
  'LocalStorageModule',
  'angucomplete',
  'config'
]);

booklibApp.service('BooklibStorage', ['localStorageService', function(localStorage){
  const USER_KEY = 'user';
  return {
    getUser: function(){
      return localStorage.get(USER_KEY);
    },
    setUser: function(user){
      localStorage.set(USER_KEY, user);
    },
    clear: function(){
      localStorage.remove(USER_KEY);
    }
  };
}]);

booklibApp.config(function ($routeProvider, $httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.withCredentials = true;
  $routeProvider
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    })
    .when('/signup', {
      templateUrl: 'views/signup.html',
      controller: 'SignUpCtrl'
    })
    .when('/dashboard/:username', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardCtrl'
    })
    .when('/404', {
      templateUrl: '404.html'
    })
    .otherwise({
      redirectTo: '/login'
    });
}).run(function(BooklibStorage, $rootScope, $location) {
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
      if (BooklibStorage.getUser() == null) {
        // Redirect not logged in user to login page
        if (next.$$route.templateUrl === "views/login.html" || next.$$route.templateUrl === 'views/signup.html') {
          // no redirect if target url is already log in or sign up page
        } else {
          $location.path("/login");
        }
      }
    });
  });
