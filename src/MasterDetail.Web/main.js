﻿require.config({
    baseUrl: "app/js"
});

require(
    [
        "../translations/translations-de",
        "constants",
        "app",
        "infrastructure/thinktecture.Authentication",
        "infrastructure/thinktecture.SignalR",
        "infrastructure/tools",
        "infrastructure/directives",
        "infrastructure/filters",
        "services/routeResolver",
        "services/alertService",
        "services/dataPushService",
        "services/logPushService",
        "services/dialogService",
        "services/articlesApiService",
        "services/personalizationService",
        "services/networkStatusService",
        "services/settingsService",
        "controllers/navigationController",
        "controllers/loginController",
        "controllers/infoController",
        "controllers/settingsController",
        "controllers/statusController"
    ],
    function () {
        angular.bootstrap(document, ["myApp"]);
    }
);
