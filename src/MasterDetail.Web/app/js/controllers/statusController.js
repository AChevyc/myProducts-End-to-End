define(["app"], function (app) {
    app.controller("StatusController", ["$scope", "networkStatusService", "personalizationService", "authenticationService", function ($scope, networkStatusService, personalizationService, authenticationService) {
        $scope.isOnline = networkStatusService.isOnline();
        
        $scope.$on(tt.personalization.dataLoaded, function () {
            $scope.userName = personalizationService.data.UiClaims.UserName;
        });
        
        $scope.$on(tt.networkstatus.onlineChanged, function (evt, isOnline) {
            $scope.isOnline = isOnline;
        });
        
        $scope.logout = function () {
            authenticationService.logout();
        };
    }]);
});