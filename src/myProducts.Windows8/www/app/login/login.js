(function () {
    "use strict";

    /**
     * @param $scope
     * @param {TokenAuthenticationService} tokenAuthenticationService
     * @param {ToastService} toastService
     * @constructor
     */
    function LoginController($scope, tokenAuthenticationService, dialogService, $translate) {
        $scope.login = {};
        $scope.login.username = "";
        $scope.login.password = "";

        $scope.login.submit = function () {
            tokenAuthenticationService.login($scope.login.username, $scope.login.password)
                .error(function (data, status, headers, config) {
                    if (status === 400) {
                        dialogService.showModalDialog({}, {
                            headerText: $translate("COMMON_ERROR"),
                            bodyText: $translate("LOGIN_FAILED"),
                            closeButtonText: $translate("COMMON_CLOSE"),
                            actionButtonText: $translate("COMMON_OK")
                        });
                    };
                });
        };
    };

    app.controller("loginController", ["$scope", "tokenAuthenticationService", "dialogService", "$translate", LoginController]);
})();
