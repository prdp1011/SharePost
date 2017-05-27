app.controller('donCtrl', ['$scope', '$rootScope', 'authSvc', '$http','$timeout', function ($scope, $rootScope, authSvc, $http,$timeout) {

    $scope.formShow = false
    $scope.formShow1 = false

    $scope.recieve = {}
    $scope.donor = {}
    $scope.groupList=[]



    $http.post('/custom/getDonationCat')
        .then(function (response) {
            if(response.data.isError){
                console.log("error in geting list")
            }else{
                $scope.groupList=response.data.data
            }

        })


    $scope.verifySend = function () {
        console.log($scope.recieve.number)

        $http.post('/custom/donOtp', {phoneNumber: $scope.recieve.number})
            .then(function (response) {
                alert(response.data.data.message)
            })
    }


    $scope.VerifyRec = function () {


        $http.post('/custom/verifyDon', {phoneNumber: $scope.recieve.number, otp: $scope.recieve.otp})
            .then(function (response) {
                console.log(response)
                $scope.openModal = false
                $scope.formShow = true

            })
        console.log($scope.recieve.otp)

    }



    $scope.verifySend2 = function () {
        console.log($scope.donor.number)

        $http.post('/custom/donOtp', {phoneNumber: $scope.donor.number})
            .then(function (response) {
                alert(response.data.data.message)
            })
    }

    $scope.VerifyRec2 = function () {

        $http.post('/custom/verifyDon', {phoneNumber: $scope.donor.number, otp: $scope.donor.otp})
            .then(function (response) {
                console.log(response)
                $scope.formShow1 = true
            })

    }


    $scope.receive1=function () {
        $rootScope.spinner.on()
        console.log('api called')
        $http.post('/custom/receiveDonation',{
            name:$scope.recieve.name,
            phoneNumber:$scope.recieve.number,
            message:$scope.recieve.message,
            type:0,
            groupId:$scope.recieve.list,
        }).then(function (response) {
            if(response.data.isError){

            }else{
                $rootScope.spinner.off()
                Materialize.toast('Successfully Send', 4000)
                $scope.recieve={}
                $scope.formShow = false

            }
            console.log(response)
        })
    }

    $scope.receive2=function () {
        $http.post('/custom/ownerDonation',{
            name:$scope.donor.name,
            phoneNumber:$scope.donor.number,
            type:1,
            groupId:$scope.donor.list,
        }).then(function (response) {
            if(response.data.isError){

            }else{
                Materialize.toast('Successfully Send', 4000)
                $scope.donor={}
                $scope.formShow1 = false

            }
            console.log(response)
        })
    }



}])


/**
 * Created by JASMINE-j on 5/27/2017.
 */
