/**
 * Created by JASMINE-j on 5/14/2017.
 */
'use strict';

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

app.controller('loginCtrl', [
    '$scope', '$location', 'authSvc', function ($scope, $location, authSvc) {
        $scope.msg = 'Please login!';

        $scope.data = {
            username: null,
            password: null
        }
        $scope.islogging = false;
        $scope.login = function () {
            console.log($scope.data)
            $scope.islogging = true;
            authSvc.login($scope.data.username, $scope.data.password).then(function (obj) {
                $scope.islogging = false;
                console.log('login success');
                console.log(obj);
                $scope.msg = 'Login Successful!';
                $location.path('/');
                return function (err) {
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
    '$scope', 'authSvc', 'Upload', '$window', 'apisrv', '$timeout','$http', function ($scope, authSvc, Upload, $window, apisrv, $timeout,$http) {
        $scope.selected = ''
        $scope.dats={}

        $http.post('/shopkeeper/getCat')
            .then(function (response) {
                if(response.data.isError){
                    alert("error")
                }else{
                    $scope.dats.select=response.data.data
                }
            })


        $scope.loadSubCat=function () {
            $http.post('/shopkeeper/getSubCat',{id:$scope.dats.Cat})
                .then(function (response) {
                    if(response.data.isError){
                        alert("error")
                    }else{
                        console.log(response)
                        $scope.dats.subCat=response.data.data.subCategory
                    }
                })
        }



        // $scope.selected=$scope.cats[0]
        $scope.submit = function () {
            console.log("running");
            if ($scope.files) {
                return $scope.upload($scope.files);
            } else {
                alert("Please Upload Images");
            }
        };
        $scope.upload = function (files) {
            $scope.dats.select.forEach(function (k) {
                if(k._id== $scope.dats.Cat){
                    $scope.dats.names=k.name
                }

            })
            console.log("called");
            $scope.data = {
                userId: authSvc.getUserInfo().id,
                category: $scope.dats.names,
                subCategory: $scope.dats.subCategory,
                name: $scope.productName,
                price: $scope.productPrice,
                files: files
            };
            Upload.upload({
                url: "/upload",
                arrayKey: '',
                data: $scope.data
            }).then(function (response) {
                console.log(response);
                alert("data uploaded");
                $scope.price = '';
                $scope.selectedCategory = '';
                return $scope.files = '';
            });
        };
    }
]).controller('AppCtrl', [
    '$scope', '$rootScope', '$route', '$document', 'authSvc', function ($scope, $rootScope, $route, $document, authSvc) {
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
        $scope.$watch('admin', function (newVal, oldVal) {
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
        return $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
            return $document.scrollTo(0, 0);
        });
    }
]).controller('HeaderCtrl', [
    '$scope', '$window', '$location', function ($scope, $window, $location) {
        return $scope.logout = function () {
            $window.localStorage.clear();
            return $location.url('/pages/signin');
        };
    }
]).controller('profileShopCtrl', [
    '$scope', function ($scope) {
        return $scope.formSubmit = function () {
            console.log($scope.data);
        };
    }
])

    .controller('NavContainerCtrl', ['$scope', function ($scope) {
    }])
    .controller('navCtrl', [
        '$scope', '$window', '$location', function ($scope, $window, $location) {


        }
    ])

app.controller('signupCtrl', ["$scope", "$http", function ($scope, $http) {
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiii")
    $scope.userData = {}

    $http.post('/getCat')
    then(function (response) {


    })

    $scope.cats = ["Cat1", 'Cat2', 'Cat3']



    $scope.signUp = function () {

        console.log($scope.userData);
        $scope.userData['role'] = 2;

        $http.post('/users/register', $scope.userData)
            .then(function (success) {

                if (success.data.isError) {
                    Materialize.toast('Phone Number Already Registered', 3000);

                    // alert("Phone Number Already Registered")
                } else {

                    Materialize.toast('Registered', 3000)
                    $scope.userData = {}
                }
                console.log(success);


            })


    }
    $scope.clearfield = function () {

        $scope.userData = {}

    }


}])


app.controller('logoutCtrl', ['$scope', '$rootScope', '$location', '$window', function ($scope, $rootScope, $location, $window) {

    $scope.logout = function () {
        console.log("lofout")
        window.localStorage.clear()
        $rootScope.signFlag = false
        $location.path('/')
        $window.location.reload()
    }


}]);


app.controller('otpCtrl', ["$scope", "$http", "$location", function ($scope, $http, $location) {
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiii")
    $scope.otpflag = false;
    $scope.otpData = {}
    $scope.otpData['showOtpField'] = false;
    $scope.otpSend = function () {
        if ($scope.otpData.showOtpField) {
            console.log($scope.otpData);
            $http.post('/users/verifyOtp', {phoneNumber: $scope.otpData.mobileNo, otp: $scope.otpData.otp})
                .then(function (success) {
                    if (success.data.isError) {
                        alert("Enter Correct OTP")

                    } else {
                        $location.path('/signupAdmin');


                    }


                })
        }
        else {
            $http.post('/users/sendOtp', {phoneNumber: $scope.otpData.mobileNo})
                .then(function (success) {
                    if (!success.data.isError) {
                        console.log(success)
                        $scope.otpData.showOtpField = true;
                    } else {

                        alert(success.data.msg)
                    }

                })
        }


    }


}]);




app.controller('eprofileCtrl', ['$scope', '$rootScope', '$http', '$window', '$location', 'Upload', '$timeout', 'apisrv', 'authSvc', '$routeParams', function ($scope, $rootScope, $http, $window, $location, Upload, $timeout, apisrv, authSvc, $routeParams) {
    $http.post('/shopkeeper/getshopkeeper', {userId: $routeParams.id})
        .then(function (response) {
            console.log(response.data.data)
            $scope.shopk = response.data.data
            $http.post('/shopkeeper/getProduct', {userId: $routeParams.id})
                .then(function (response) {
                    console.log(response.data.data)
                    $scope.profileProduct = response.data.data

                        $scope.profileProduct.forEach(function(dats){
                                if (dats.pImages.length>0){
                                $scope.myObj = {
                                        'padding-top': '15%'
                                      }

                                    dats['myObj'] =  $scope.myObj
                            }

                            else{

                                $scope.myObj = {}
                                dats['myObj'] =  $scope.myObj;
                            }
                        })


                })


        })

       $scope.deleteCard =function(p){
            console.log(p)



       }
    $scope.removePhoto = function (url, pId) {
        $http.post('/shopkeeper/removeProduct', {pId: pId, url: url})
            .then(function (response) {
                if (response.data.isError) {
                    alert("error in removing")
                } else {
                    console.log(response.data.data)
                    $scope.profileProduct = response.data.data
                    $http.post('/shopkeeper/getProduct',{userId: $routeParams.id})
                        .then(function (response) {
                            console.log(response.data.data)
                            $scope.profileProduct = response.data.data

                            $scope.profileProduct.forEach(function(dats){
                                if (dats.pImages.length>0){
                                $scope.myObj = {
                                        'padding-top': '15%'
                                      }

                                    dats['myObj'] =  $scope.myObj
                            }

                            else{

                                $scope.myObj = {}
                                dats['myObj'] =  $scope.myObj;
                            }
                        })



                        })

                }


            })


    }
    console.log("asdkhasl")


}]);
app.controller('profileCtrl', ['$scope', '$rootScope', '$http', '$window', '$location', 'Upload', '$timeout', 'apisrv', 'authSvc', function ($scope, $rootScope, $http, $window, $location, Upload, $timeout, apisrv, authSvc) {

    $scope.shop = authSvc.getUserInfo()
    $http.post('/shopkeeper/getProduct', {userId: authSvc.getUserInfo().id})
        .then(function (response) {
            console.log(response.data.data)
            $scope.profileProduct = response.data.data

                $scope.profileProduct.forEach(function(dats){
                                if (dats.pImages.length>0){
                                $scope.myObj = {
                                        'padding-top': '15%'
                                      }

                                    dats['myObj'] =  $scope.myObj
                            }

                            else{

                                $scope.myObj = {}
                                dats['myObj'] =  $scope.myObj;
                            }
                        })

        })


    $scope.removePhoto = function (url, pId) {
        $http.post('/shopkeeper/removeProduct', {pId: pId, url: url})
            .then(function (response) {
                if (response.data.isError) {
                    alert("error in removing")
                } else {
                    console.log(response.data.data)
                    $scope.profileProduct = response.data.data
                    $http.post('/shopkeeper/getProduct', {userId: authSvc.getUserInfo().id})
                        .then(function (response) {
                            console.log(response.data.data)
                            $scope.profileProduct = response.data.data

                            $scope.profileProduct.forEach(function(dats){
                                if (dats.pImages.length>0){
                                $scope.myObj = {
                                        'padding-top': '15%'
                                      }

                                    dats['myObj'] =  $scope.myObj
                            }

                            else{

                                $scope.myObj = {}
                                dats['myObj'] =  $scope.myObj;
                            }
                        })


                        })

                }


            })


    }
    console.log("asdkhasl")


}]);

app.controller('homeCtrl', ['$scope', '$rootScope', '$window','$http', function ($scope, $rootScope, $window,$http) {



}])