/**
 * Created by JASMINE-j on 5/14/2017.
 */

'use strict';
app.factory('apisrv', [
    '$location', function($location) {
        var api_urlbuilder, obj;
        obj = {};
        api_urlbuilder = '';
        obj.config = {
            host: "/"
        };
        obj.path = function(rpath) {
            return obj.config.host + rpath;
        };
        return obj;
    }
]);

app.run(function($rootScope, $location, $http, apisrv, $filter, authSvc) {
    $rootScope.$on('$routeChangeSuccess', function(userinfo) {
        return console.log('testsuccess', userinfo);
    });
    return $rootScope.$on('$routeChangeError', function(event, current, previous, eventObj) {
        console.log('test', eventObj);
        if (eventObj.authenticated === false) {
            console.log('Need to Redirect to login page');
            $location.path('/pages/signin');
        }
        if (eventObj.allowed === false) {
            console.log('Page Not Allowed');
            return $location.path('/pages/notallowed');
        }
    });
});
