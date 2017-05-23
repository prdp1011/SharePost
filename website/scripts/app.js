/**
 * Created by JASMINE-j on 5/14/2017.
 */
var app = angular.module('ofBuzz', [
    'ui.materialize',
    'ngRoute',
    'ngAnimate',
    'vsGoogleAutocomplete',
    'ngFileUpload',
    'nvd3'
]);


app.factory('authSvc', function ($http, $q, $window, apisrv, $rootScope) {
    var self, setAuthHeader, storage_key;
    self = this;
    self.userinfo = null;
    storage_key = 'ofbuzz';
    setAuthHeader = function () {
        return $http.defaults.headers.common['Username'] = self.userinfo.username;
    };
    self.onlogin = function (uname, data) {
        self.userinfo = {
            username: uname,
            address: data.address,
            firstName: data.firstName,
            emailId: data.emailId,
            phoneNumber: data.phoneNumber,
            id: data.id,
            role: data.role
        };

        $window.localStorage[storage_key] = JSON.stringify(self.userinfo);
        return setAuthHeader();
    };
    self.init = function () {
        var storage;
        console.log('initializing autSrv');
        if ($window.localStorage[storage_key]) {
            storage = $window.localStorage[storage_key];
            self.userinfo = JSON.parse(storage);
            $rootScope.signFlag = true
            $rootScope.userinfo = self.userinfo;
            console.log(self.userinfo);
            setAuthHeader();
            console.log('onlogin', self.userinfo.role)
            $rootScope.role = self.userinfo.role;

            return console.log('loading ... userinfo');
        } else {
            $rootScope.signFlag = false

        }
    };
    self.login = function (username, password) {
        var deferred;
        deferred = $q.defer();
        $http.get("/users/login?username=" + username + "&password=" + password).then(function (result) {
            console.log(result);
            if (result.data.isError) {
                return deferred.reject(result.data);
            } else {
                $rootScope.signFlag = true

                console.log("api data", result.data);
                self.onlogin(username, result.data.data);
                $rootScope.role = self.userinfo.role
                return deferred.resolve(self.userinfo);
            }
        });
        return deferred.promise;
    };
    self.getUserInfo = function () {
        console.log('Getting userinfo');
        console.log(self.userinfo);
        return self.userinfo;
    };
    self.init();
    return {
        login: self.login,
        getUserInfo: self.getUserInfo,
        onlogin: self.onlogin,
        init: self.init
    };
})


app.config([
'$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

$locationProvider.html5Mode(false).hashPrefix('');
routes = [];
blacklist = ['pages/admin'];

 setRoutes1 = function(route) {
    var config, url;
    url = '/' + route;
    config = {
        templateUrl: 'views/' + route + '.html',
        resolve: {
            auth: [
                '$q', 'authSvc', '$rootScope', function($q, authSvc, $rootScope) {
                    var pinfo, role, userinfo, _i, _len, _ref;
                    userinfo = authSvc.getUserInfo();
                    $rootScope.userinfo = userinfo;
                    console.log('validating authentication.');

                    if(userinfo){
                      return $q.when(userinfo);
                    }else {
                        return $q.reject({
                            authenticated: false
                        });
                    }
                }
            ]
        }
    };
    $routeProvider.when(url, config);
    return $routeProvider;
};
 setRoutes2 = function(route) {
    var config, url;
    url = '/' + route;
    config = {
        templateUrl: 'views/' + route + '.html',
        resolve: {
            auth: [
                '$q', 'authSvc', '$rootScope', function($q, authSvc, $rootScope) {
                    var pinfo, role, userinfo, _i, _len, _ref;
                    userinfo = authSvc.getUserInfo();
                    $rootScope.userinfo = userinfo;
                    console.log('validating authentication.');

                    if(userinfo){
                    if (userinfo.role==1) {
                      return $q.when(userinfo);
                    }else{
                        return $q.reject({
                            authenticated: false
                        });
                    }
                    }else {
                        return $q.reject({
                            authenticated: false
                        });
                    }
                }
            ]
        }
    };
    $routeProvider.when(url, config);
    return $routeProvider;
};
routes.forEach(function(route) {
    return setRoutes1(route);
});
blacklist.forEach(function(route) {
    return setRoutes2(route);
});


 $routeProvider.when('/',{templateUrl:'views/pages/home.html'})
     .when('/otpAdmin', {
    templateUrl: 'views/pages/otp.html'
}).when('/signupAdmin', {
    templateUrl: 'views/pages/signup.html'
}).when('/pages/eprofile/:id', {
    templateUrl: 'views/pages/aeditProfile.html'
}).when('/signIn', {
    templateUrl: 'views/pages/signIn.html'
}).when('/uploadPro', {
    templateUrl: 'views/pages/uploadProduct.html'
}).when('/profile', {
    templateUrl: 'views/pages/profile.html'
}).when('/404', {
    templateUrl: 'views/pages/404.html'
}).otherwise({
    redirectTo: '/404'
});
}
])




app.directive('nxEqual', function() {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, model) {
            if (!attrs.nxEqual) {
                console.error('nxEqual expects a model as an argument!');
                return;
            }
            scope.$watch(attrs.nxEqual, function (value) {
                model.$setValidity('nxEqual', value === model.$viewValue);
            });
            model.$parsers.push(function (value) {
                var isValid = value === scope.$eval(attrs.nxEqual);
                model.$setValidity('nxEqual', isValid);
                return isValid ? value : undefined;
            });
        }
    };
});


app.run(['$rootScope','$http','authSvc',function ($rootScope,$http,authSvc) {


    console.log("rooot", authSvc.getUserInfo().role)
    $http.post('/admin/getNotification',{role:authSvc.getUserInfo().role})
        .then(function (response) {
            if(response.data.isError){
                console.log("error")
            }else{
                console.log(response.data.data)
                $rootScope.noti=response.data.data.notification
            }


        })


}])