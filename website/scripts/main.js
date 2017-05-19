/**
 * Created by JASMINE-j on 5/14/2017.
 */
'use strict';
app.factory('authSvc', function($http, $q, $window, apisrv, $rootScope) {
    var self, setAuthHeader, storage_key;
    self = this;
    self.userinfo = null;
    storage_key = 'ofbuzz';
    setAuthHeader = function() {
        return $http.defaults.headers.common['Username'] = self.userinfo.username;
    };
    self.onlogin = function(uname, data) {
        self.userinfo = {
            username: uname,
            firstName: data.firstName,
            emailId: data.emailId,
            phoneNumber: data.phoneNumber,
            id: data.id
        };
        $window.localStorage[storage_key] = JSON.stringify(self.userinfo);
        return setAuthHeader();
    };
    self.init = function() {
        var storage;
        console.log('initializing autSrv');
        if ($window.localStorage[storage_key]) {
            storage = $window.localStorage[storage_key];
            self.userinfo = JSON.parse(storage);
            $rootScope.signFlag=true
            $rootScope.userinfo = self.userinfo;
            console.log(self.userinfo);
            setAuthHeader();
            return console.log('loading ... userinfo');
        }else{
            $rootScope.signFlag=false

        }
    };
    self.login = function(username, password) {
        var deferred;
        deferred = $q.defer();
        $http.get("/users/login?username="+username+"&password="+password).then(function(result) {
            console.log(result);
            if (result.data.isError) {
                return deferred.reject(result.data);
            } else {
                $rootScope.signFlag=true
                console.log("api data", result.data);
                self.onlogin(username, result.data.data);
                return deferred.resolve(self.userinfo);
            }
        });
        return deferred.promise;
    };
    self.getUserInfo = function() {
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
 app.controller('loginCtrl', [
    '$scope', '$location', 'authSvc', function($scope, $location, authSvc) {
        $scope.msg = 'Please login!';

        $scope.data={
            username:null,
            password:null}
        $scope.islogging = false;
        $scope.login = function() {
            console.log($scope.data)
            $scope.islogging = true;
            authSvc.login($scope.data.username, $scope.data.password).then(function(obj) {
                $scope.islogging = false;
                console.log('login success');
                console.log(obj);
                $scope.msg = 'Login Successful!';
                $location.path('/');
                return function(err) {
                    if (err.status === 'err') {
                        $scope.msg = err.msg;
                    }
                    console.log(err);
                    return $scope.islogging = false;
                };

            });
        };
    }
]).controller('uploadPro', [
    '$scope', 'authSvc', 'Upload', '$window', 'apisrv', '$timeout', function($scope, authSvc, Upload, $window, apisrv, $timeout) {
        $scope.names = ['pulses', 'Chocolate', 'grocery'];
        $scope.cats= ["Cat1",'Cat2','Cat3']
        $scope.selected=''
        // $scope.selected=$scope.cats[0]
        $scope.submit = function() {
            console.log("running");
            if ($scope.files) {
                return $scope.upload($scope.files);
            } else {
                alert("Please Upload Images");
            }
        };
        $scope.upload = function(files) {
            console.log("called");
            $scope.data = {
                // userId: authSvc.getUserInfo().id,
                category: $scope.category,
                subCategory:$scope.subCategory,
                name: $scope.productName,
                price:$scope.productPrice,
                files: files
            };
            Upload.upload({
                url: apisrv.path("/upload"),
                arrayKey: '',
                data: $scope.data
            }).then(function(response) {
                console.log(response);
                alert("data uploaded");
                $scope.price = '';
                $scope.selectedCategory = '';
                return $scope.files = '';
            });
        };
    }
]).controller('AppCtrl', [
    '$scope', '$rootScope', '$route', '$document', 'authSvc', function($scope, $rootScope, $route, $document, authSvc) {
        var $window;
        $window = $(window);
        $scope.profileData = authSvc.getUserInfo();
        if ($scope.profileData) {
            $scope.main = {
                brand: 'Off Buzz',
                name: "" + $scope.profileData.firstName + "" + $scope.profileData.lastName + "",
                imgPath: "../images/g1.jpg",
                emailId: $scope.profileData.emailId,
                phoneNumber: $scope.profileData.phoneNumber
            };
        }
        $scope.admin = {
            layout: 'wide',
            menu: 'vertical',
            fixedHeader: true,
            fixedSidebar: true
        };
        $scope.$watch('admin', function(newVal, oldVal) {
            if (newVal.menu === 'horizontal' && oldVal.menu === 'vertical') {
                $rootScope.$broadcast('nav:reset');
                return;
            }
            if (newVal.fixedHeader === false && newVal.fixedSidebar === true) {
                if (oldVal.fixedHeader === false && oldVal.fixedSidebar === false) {
                    $scope.admin.fixedHeader = true;
                    $scope.admin.fixedSidebar = true;
                }
                if (oldVal.fixedHeader === true && oldVal.fixedSidebar === true) {
                    $scope.admin.fixedHeader = false;
                    $scope.admin.fixedSidebar = false;
                }
                return;
            }
            if (newVal.fixedSidebar === true) {
                $scope.admin.fixedHeader = true;
            }
            if (newVal.fixedHeader === false) {
                $scope.admin.fixedSidebar = false;
            }
        }, true);
        $scope.color = {
            primary: '#1BB7A0',
            success: '#94B758',
            info: '#56BDF1',
            infoAlt: '#7F6EC7',
            warning: '#F3C536',
            danger: '#FA7B58'
        };
        return $rootScope.$on("$routeChangeSuccess", function(event, currentRoute, previousRoute) {
            return $document.scrollTo(0, 0);
        });
    }
]).controller('HeaderCtrl', [
    '$scope', '$window', '$location', function($scope, $window, $location) {
        return $scope.logout = function() {
            $window.localStorage.clear();
            return $location.url('/pages/signin');
        };
    }
]).controller('profileShopCtrl', [
    '$scope', function($scope) {
        return $scope.formSubmit = function() {
            console.log($scope.data);
        };
    }
])

.controller('NavContainerCtrl', ['$scope', function($scope) {}])
    .controller('navCtrl', [
    '$scope','$window', '$location', function($scope, $window, $location) {




    }
])

app.controller('signupCtrl', ["$scope","$http", function ($scope,$http) {
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiii")
    $scope.userData= {}

    $scope.signUp= function(){

        console.log($scope.userData);
            $scope.userData['role'] = 2;

        $http.post('/users/register', $scope.userData)
                .then(function (success) {

                 if(success.data.isError){
                    Materialize.toast('Phone Number Already Registered', 3000);

                   // alert("Phone Number Already Registered")
                 }else{

                        Materialize.toast('Registered', 3000)
                         $scope.userData= {}
                 }   
                console.log(success);


                })


    }
    $scope.clearfield =function(){

        $scope.userData= {} 

    }
    $scope.cats= ["Cat1",'Cat2','Cat3']

}])


app.controller('logoutCtrl',['$scope','$rootScope','$location','$window',function ($scope,$rootScope,$location,$window) {

            $scope.logout=function () {
                console.log("lofout")
               window.localStorage.clear();
                $rootScope.signFlag=false
                $location.path('/')
            }


}]);


app.controller('otpCtrl', ["$scope","$http", "$location", function ($scope,$http,$location ) {
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiii")
    $scope.otpflag=false;
    $scope.otpData= {}
    $scope.otpData['showOtpField']=false;
    $scope.otpSend= function(){
        if($scope.otpData.showOtpField){
            console.log($scope.otpData);
            $http.post('/users/verifyOtp',{phoneNumber:$scope.otpData.mobileNo,otp:$scope.otpData.otp})
                .then(function (success) {
                    if(success.data.isError){
                        alert("Enter Correct OTP")

                    }else{
                        $location.path('/signupAdmin');


                    }


                })
        }
        else{
            $http.post('/users/sendOtp',{phoneNumber:$scope.otpData.mobileNo})
                .then(function (success) {
                    if(!success.data.isError){
                        console.log(success)
                        $scope.otpData.showOtpField=true;}else{

                        alert(success.data.msg)
                    }

                })
        }



    }


}]);


app.controller('adminCtrl',['$scope','$rootScope','$http','$window','$location',function ($scope,$rootScope,$http,$window,$location) {


$scope.chartFlag=true
$scope.shopFlag=true
    $scope.options = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 450,
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            showControls: true,
            showValues: true,
            duration: 500,
            xAxis: {
                showMaxMin: false
            },
            yAxis: {
                axisLabel: 'Values',
                tickFormat: function(d){
                    return d3.format(',.2f')(d);
                }
            }

        },
        title:{
            enable:true,
            text:"All Users Registration chart",
            className:"H4"
        }
    };
$http.get('/admin/dashboard')
    .then(function (response) {

        console.log(response.data.data)
        $scope.data=response.data.data
        $scope.chartFlag=false

    })


    $scope.select={
        value:null
    }
 $http.post('/admin/shopkeeper',{id:0}).then(function (response2) {

     console.log("=============",response2)
     $scope.select.choices=response2.data.data;
     $scope.select.value=$scope.select.choices[0]._id;
     $scope.shopFlag=false
     $scope.loadDetail();

 })
$scope.shop={}
    $scope.loadDetail=function () {
        $scope.shopFlag=true
        console.log('loading',{id:$scope.select.value})
        $http.post('/admin/shopkeeper',{id:$scope.select.value}).then(function (response3) {

            console.log("fetched",response3)
            $scope.shop=response3.data.data[0];
            if(response3.data.data[0].approved==1){
                $scope.shop.approve=true
            }else{
                $scope.shop.approve=false

            }
            $scope.shopFlag=false



        })

    }

    $scope.changeApproval=function () {

    console.log($scope.shop.approve)

        if($scope.shop.approve){

        $http.get('/admin/approve?id='+$scope.shop._id+"&approve=1").then(function (resp) {

            console.log(resp.data.data)

        })
        }else{
            $http.get('/admin/approve?id='+$scope.shop._id+"&approve=0").then(function (resp) {

                console.log(resp.data.data)

            })
        }

    }















        }])
