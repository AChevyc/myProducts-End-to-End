define(["app"], function (app) {
    app.controller("NavigationController", ["$http", "$scope", "$translate", "personalizationService",
        function ($http, $scope, $translate, personalizationService) {
            $scope.currentLanguage = $translate.preferredLanguage() || $translate.proposedLanguage();
            
            $scope.$on(tt.personalization.dataLoaded, function () {
                $scope.navigationItems = personalizationService.data.Features;
            });

            $scope.$on(tt.authentication.logoutConfirmed, function () {
                $scope.navigationItems = null;
            });
            
            $scope.changeLanguage = function (langKey) {
                $scope.currentLanguage = langKey;
                $translate.uses(langKey);
            };
        }]);
});