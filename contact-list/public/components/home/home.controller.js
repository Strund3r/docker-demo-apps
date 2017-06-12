/* global AUTH0_DOMAIN, AUTH0_CLIENT_ID */

'use strict';

angular
        .module('app')
        .controller('HomeController', ['authService', '$rootScope', 'angularAuth0', '$location', '$scope', function (authService, $rootScope, angularAuth0, $location, $scope) {

            var vm = this;
            vm.authService = authService;

            vm.logoutFromAuth0 = function () {
                angularAuth0.logout({returnTo: $location.url});
                authService.logout();
            };
            $rootScope.logoutFromAuth0 = vm.logoutFromAuth0; // so that it could be accessed outside home controller

            authService.getProfileDeferred().then(function (profile) {
                vm.profile = profile;
                $rootScope.profile = profile; // so that it could be accessed outside home controller
            });


//            $scope.AUTH0_DOMAIN = AUTH0_DOMAIN;
//            $scope.SCOPE = "all:contacts";
//            $scope.AUDIENCE = "local-contacts-api";
//            $scope.AUTH0_CLIENT_ID = AUTH0_CLIENT_ID;
//            $scope.REDIRECT_URL = "http://localhost:800/#/home";

        }]);



