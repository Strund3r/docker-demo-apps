'use strict';

angular
        .module('app')
        .controller('ContactsController', ['$scope', 'authService', '$http', '$state', function ($scope, authService, $http) {

            var vm = this;
            vm.authService = authService;


            var refresh = function () {
                // Simple GET request example:
                $http({
                    method: 'GET',
                    url: '/contacts',
                    headers: {Authorization: "Bearer " + localStorage.getItem('id_token')}
                }).then(function (response) {
                    console.log('Data received successfully', response.data);
                    $scope.contactlist = response.data;
                }, function (response) {
                    console.log("Error, token=" + localStorage.getItem('id_token'));
                });
            };

            $scope.addContact = function () {
                console.log("Inserting contact ...");
                $http({
                    method: 'POST',
                    url: '/contacts',
                    headers: {Authorization: "Bearer " + localStorage.getItem('id_token')},
                    data: $scope.contact
                }).then(refresh());

            };

            $scope.deleteContact = function (id) {
                console.log("Deleting contact with " + id);
                $http({
                    method: 'DELETE',
                    url: '/contacts/' + id,
                    headers: {Authorization: "Bearer " + localStorage.getItem('id_token')}
                }).then(refresh());
            };

            console.log("Controller initialized");
            refresh();

        }]);
