'use strict';

angular
        .module('app')
        .controller('LoginController', ['authService', '$rootScope', '$state', function (authService, $rootScope, $state) {

            var vm = this;
            vm.authService = authService;

            if ($rootScope.isAuthenticated) {
                console.log("Already authenticated", authService);
                $state.go('home');
            }

        }]);