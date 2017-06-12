/* global AUTH0_CLIENT_ID, AUTH0_DOMAIN */

'use strict';

angular
        .module('app', ['auth0.auth0', 'auth0.lock', 'angular-jwt', 'ui.router'])
        .config(['$stateProvider', 'lockProvider', '$urlRouterProvider', 'jwtOptionsProvider', 'angularAuth0Provider', function ($stateProvider, lockProvider, $urlRouterProvider, jwtOptionsProvider, angularAuth0Provider) {

                $stateProvider
                        .state('home', {
                            url: '/home',
                            controller: 'HomeController',
                            templateUrl: 'components/home/home.html',
                            controllerAs: 'vm'
                        })
                        .state('contacts', {
                            url: '/contactlist',
                            controller: 'ContactsController',
                            templateUrl: 'components/contacts/contacts.html',
                            controllerAs: 'vm',
                            data: {
                                requiresLogin: true
                            }
                        })
                        .state('login', {
                            url: '/login',
                            controller: 'LoginController',
                            templateUrl: 'components/login/login.html',
                            controllerAs: 'vm'
                        });
                lockProvider.init({
                    clientID: AUTH0_CLIENT_ID,
                    domain: AUTH0_DOMAIN,
                    options: {
                        theme: {
                            logo: 'http://esingenieria.uca.es/wp-content/themes/esi-theme-v2/images/LogoUCA.png',
                            primaryColor: "#E59539"
                        },
                        languageDictionary: {
                            title: "Awesome contacts list"
                        }
                    }
                });
                angularAuth0Provider.init({
                    clientID: AUTH0_CLIENT_ID,
                    domain: AUTH0_DOMAIN
                });
                $urlRouterProvider.otherwise('/home');
                // Configuration for angular-jwt
                jwtOptionsProvider.config({
                    tokenGetter: ['options', function (options) {
                            if (options && options.url.substr(options.url.length - 5) === '.html') {
                                return null;
                            }
                            return localStorage.getItem('id_token');
                        }],
                    whiteListedDomains: ['localhost'],
                    unauthenticatedRedirectPath: '/login'
                });
            }
        ]);
