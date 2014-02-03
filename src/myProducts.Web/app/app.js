﻿window.$app = window.$app || {};
var app;

if (ttMobile) {
    app = angular.module("myApp", ["ui.router", "ngTouch", "ngAnimate", "Thinktecture.SignalR", "Thinktecture.Authentication", "ngCookies", "pascalprecht.translate", "routeResolverServices", "ngStorage", "nvd3ChartDirectives", "jmdobry.angular-cache", "ionic", "chieffancypants.loadingBar", "btford.phonegap.ready", "btford.phonegap.geolocation"]);
} else {
    app = angular.module("myApp", ["ui.router", "ngTouch", "ngAnimate", "$strap.directives", "ui.bootstrap", "Thinktecture.SignalR", "Thinktecture.Authentication", "ngCookies", "pascalprecht.translate", "routeResolverServices", "angular-carousel", "frapontillo.bootstrap-switch", "ngStorage", "imageupload", "nvd3ChartDirectives", "jmdobry.angular-cache", "chieffancypants.loadingBar", "btford.phonegap.ready", "btford.phonegap.geolocation"]);
}

app.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$translateProvider", "$httpProvider", "$controllerProvider", "$compileProvider", "$filterProvider", "$provide", "cfpLoadingBarProvider", "tokenAuthenticationProvider",
    function ($stateProvider, $urlRouterProvider, $routeProvider, $locationProvider, $translateProvider, $httpProvider, routeResolverProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, cfpLoadingBarProvider, tokenAuthenticationProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);

        cfpLoadingBarProvider.includeSpinner = false;

        tokenAuthenticationProvider.setUrl(ttTools.baseUrl + "token");

        ttTools.initLogger(ttTools.baseUrl + "api/log");
        ttTools.logger.info("Configuring myApp...");

        var viewBaseUrl = "app/";

        if (ttMobile) {
            viewBaseUrl = "mobile/";
        }

        $urlRouterProvider.otherwise("/");
        $stateProvider
          .state('info', {
              url: "/info",
              templateUrl: viewBaseUrl + "info/info.html",
              controller: "InfoController"
          })
          .state('settings', {
              url: "/settings",
              templateUrl: viewBaseUrl + "settings/settings.html",
              controller: "SettingsController"
          })
          .state('login', {
              url: "/login",
              templateUrl: viewBaseUrl + "login/login.html",
              controller: "LoginController"
          })
          .state('start', {
              url: "/",
              templateUrl: viewBaseUrl + "start/start.html",
              controller: "StartController"
          });

        $provide.factory("$stateProviderService", function () {
            return $stateProvider;
        });

        $translateProvider.translations("de", tt.translations.de);
        $translateProvider.useStaticFilesLoader({
            prefix: "app/translations/locale-",
            suffix: ".json"
        });
        $translateProvider.preferredLanguage("en");
        $translateProvider.useLocalStorage();
    }]);

app.run(["$stateProviderService", "$http", "$templateCache", "$rootScope", "$location", "$translate", "toast", "dialog", "$route", "personalization", "categories", "geoLocationTracker", "articlesPush", "logPush",
    function ($stateProviderService, $http, $templateCache, $rootScope, $location, $translate, toast, dialog, $route, personalization, categories, geoLocationTracker, articlesPush, logPush) {
        geoLocationTracker.startSendPosition(10000, function (pos) { });

        window.addEventListener("online", function () {
            $rootScope.$apply($rootScope.$broadcast(tt.networkstatus.onlineChanged, true));
        }, true);
        window.addEventListener("offline", function () {
            $rootScope.$apply($rootScope.$broadcast(tt.networkstatus.onlineChanged, false));
        }, true);

        $http.defaults.headers.common["Accept-Language"] = $translate.uses();
        $rootScope.$on("$translateChangeSuccess", function () {
            $http.defaults.headers.common["Accept-Language"] = $translate.uses();
        });

        $http.get(viewsDir + "info/info.html", { cache: $templateCache });

        $rootScope.$on(tt.authentication.loggedIn, function () {
            $http({ method: "GET", url: ttTools.baseUrl + "api/personalization" })
            .success(function (data) {
                if (!categories.data) {
                    $http({ method: "GET", url: ttTools.baseUrl + "api/categories" })
                    .success(function (data) {
                        categories.data = data;
                    });
                }

                personalization.data = data;
                
                angular.forEach(data.Features, function (value, key) {
                    var viewUrl = viewsDir + value.Module.toLowerCase() + "/" + value.Module.toLowerCase() + ".html";

                    $stateProviderService.state('dynamicController', {
                        url: value.Url,
                        template: viewUrl,
                        controllerProvider: function ($stateParams) {
                            ctrlName = value.Module + "Controller";
                            return ctrlName;
                        }
                    });
                    //$routeProviderService.when(value.Url, route.resolve(value.Module));
                    $http.get(viewsDir + value.Module.toLowerCase() + "/" + value.Module.toLowerCase() + ".html", { cache: $templateCache });
                });

                $rootScope.$broadcast(tt.personalization.dataLoaded);
                //$route.reload();
            });
        });

        // TODO: what about unloading!?

        window.applicationCache.addEventListener("updateready", function (ev) {
            if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
                console.log("CACHE: Browser downloaded a new app cache manifest.");
                window.applicationCache.swapCache();

                $rootScope.$apply(dialog.showModalDialog({}, {
                    headerText: "App Update",
                    bodyText: $translate("APP_UPDATE_BODY"),
                    closeButtonText: $translate("COMMON_NO"),
                    actionButtonText: $translate("COMMON_YES")
                }).then(function (result) {
                    window.location.reload();
                    console.log("CACHE: App will be updated...");
                }));
            } else {
                console.log("CACHE: Manifest didn\'t change.");
            }
        }, false);

        $rootScope.$on("$routeChangeStart", function () {
            if (!$rootScope.tt.authentication.userLoggedIn) {
                $rootScope.$broadcast(tt.authentication.authenticationRequired);
            }
        });

        $rootScope.$on(tt.authentication.authenticationRequired, function () {
            $location.path("/login");
        });
        $rootScope.$on(tt.authentication.loginConfirmed, function () {
            $location.path("/");

            toast.pop({
                title: "Login",
                body: $translate("LOGIN_SUCCESS"),
                type: "success"
            });
        });
        $rootScope.$on(tt.authentication.loginFailed, function () {
            $location.path("/login");
            toast.pop({
                title: "Login",
                body: $translate("LOGIN_FAILED"),
                type: "error"
            });
        });
        $rootScope.$on(tt.authentication.logoutConfirmed, function () {
            $location.path("/login");
        });

        $rootScope.ttAppLoaded = true;
    }]);

app.animation(".reveal-animation", function () {
    return {
        enter: function (element, done) {
            element.css("display", "none");
            element.fadeIn(500, done);
            return function () {
                element.stop();
            };
        },
        leave: function (element, done) {
            element.fadeOut(500, done);
            return function () {
                element.stop();
            };
        }
    };
});
