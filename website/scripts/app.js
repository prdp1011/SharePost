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


app.config([
'$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

$locationProvider.html5Mode(false).hashPrefix('');
routes = [];
blacklist = [];

// var setRoutes = function(route) {
//     var config, url;
//     url = '/' + route;
//     config = {
//         templateUrl: 'views/' + route + '.html',
//         resolve: {
//             auth: [
//                 '$q', 'authSvc', '$rootScope', function($q, authSvc, $rootScope) {
//                     var pinfo, role, userinfo, _i, _len, _ref;
//                     userinfo = authSvc.getUserInfo();
//                     $rootScope.userinfo = userinfo;
//                     console.log('validating authentication.');
//                     if (userinfo) {
//                       return $q.when(userinfo);
//                     } else {
//                         return $q.reject({
//                             authenticated: false
//                         });
//                     }
//                 }
//             ]
//         }
//     };
//     $routeProvider.when(url, config);
//     return $routeProvider;
// };
// routes.forEach(function(route) {
//     return setRoutes(route);
// });


 $routeProvider.when('/',{templateUrl:'views/pages/home.html'})
     .when('/otpAdmin', {
    templateUrl: 'views/pages/otp.html'
}).when('/signupAdmin', {
    templateUrl: 'views/pages/signup.html'
}).when('/signIn', {
    templateUrl: 'views/pages/signIn.html'
}).when('/admin', {
    templateUrl: 'views/pages/admin.html'
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