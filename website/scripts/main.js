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
            role: data.role,
            approved:data.approved
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
            console.log('onlogin', self.userinfo.approved)
            $rootScope.role = self.userinfo.role;
            $rootScope.approved = self.userinfo.approved;
            console.log('loading ... userinfo');
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
                $rootScope.approved = self.userinfo.approved
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
        '$scope','$rootScope', '$window', '$location','$http', function ($scope, $rootScope,$window, $location,$http) {

    $scope.notifyMe=function () {
        $rootScope.isButtonActive=true

        $http.post('/admin/delNoti').then(function (response) {
            $rootScope.noti=0;
            $location.path('/pages/admin')

        })


    }

        }
    ])

app.controller('signupCtrl', ["$scope", "$http","$routeParams","$location" ,function ($scope, $http,$routeParams,$location) {
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiii")
    $scope.userData = {}

    $http.post('/admin/getCat')
        .then(function (response) {
            console.log("fff",response)

            $scope.cats=response.data.data
    })

    console.log("passed",$routeParams.phone)
    $scope.userData.phoneNumber = $routeParams.phone;


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
                    $location.path('/signIn')
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
                        console.log(success.data.data)
                        $location.path("/signupAdmin/"+$scope.otpData.mobileNo);


                    }


                })
        }
        else {
            $http.post('/users/sendOtp', {phoneNumber: $scope.otpData.mobileNo})
                .then(function (success) {
                    if (!success.data.isError) {
                        console.log(success.data.data.message)
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
                        })

                }


            })


    }
        var datatoBeSend = {};
    $scope.picChangeBackground=function(arg1,file, errFiles){
       
        var datatoBeSend = {
            'id': arg1.id,
            type: 0 
        }
             console.log(datatoBeSend)
             console.log($scope.bgImageUrl)
            $scope.uploadFiles(datatoBeSend, file, errFiles)

    }
     $scope.uploadProfilePic=function(arg, file, errFiles){
        var datatoBeSendProfile = {
            'id': arg.id,
            type:1
        }
             console.log(datatoBeSendProfile);
             $scope.uploadFiles(datatoBeSendProfile, file, errFiles)

    }
    


 $scope.uploadFiles = function(arg, file, errFiles) {
        $scope.datatoBeSendProfile = {
            'file' : file,
            'type':arg.type,
            'id' : arg.id
        };

        console.log( $scope.datatoBeSendProfile);
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: '/upload',
                arrayKey: '',
                data:  $scope.datatoBeSendProfile
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    console.log(file.result)
                });
            }, function (response) {

                console.log(response)
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        }

        console.log(file)   
    }





}]);


app.controller('phoneDiaryCtrl',['$scope', '$rootScope', '$window','$http', function ($scope, $rootScope, $window,$http) {

    $(document).ready(function() {
        $('ul.tabs').tabs();
        $("#btnContinue").click(function() {
            $('ul.tabs').tabs('select_tab', 'test2');
        });
    });




$scope.dataM={}
$scope.filterData=''
    $scope.Search=''


    $http.post('/admin/getDcat')
        .then(function (response) {
            if(response.data.isError){
                alert("error")
            }else{
                $scope.loadMe=response.data.data
            }

        })
    $http.post('/admin/getNumber')
        .then(function (response) {


            $scope.diary=response.data.data

        })


    $scope.filterCat=function () {

        $scope.filterData=$scope.dataM.cat

    }
}])

app.controller('homeCtrl', ['$scope', '$rootScope', '$window','$http', function ($scope, $rootScope, $window,$http) {



}])