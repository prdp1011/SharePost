

app.controller('adminCtrl', ['$scope', '$rootScope', '$http', '$window', '$location', 'Upload', '$timeout', 'apisrv', function ($scope, $rootScope, $http, $window, $location, Upload, $timeout, apisrv) {


    $scope.oldList = [];
    $scope.getData = {}
    $scope.newList = []
    $scope.dataM = {};
    $scope.edit = {};
    $scope.e={}
    $scope.edit.listText = ''
    $scope.edit.value = ''
    $scope.showList = [];
    $scope.dataSaved = {}
    console.log("show list", $scope.showList)
    $scope.chartFlag = true
    $scope.shopFlag = true
    $scope.options = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 450,
            x: function (d) {
                return d.label;
            },
            y: function (d) {
                return d.value;
            },
            showControls: true,
            showValues: true,
            duration: 500,
            xAxis: {
                showMaxMin: false
            },
            yAxis: {
                axisLabel: 'Values',
                tickFormat: function (d) {
                    return d3.format(',.2f')(d);
                }
            }

        },
        title: {
            enable: true,
            text: "All Users Registration chart",
            className: "H4"
        }
    };
    $http.get('/admin/dashboard')
        .then(function (response) {

            console.log(response.data.data)
            $scope.data = response.data.data
            $scope.chartFlag = false

        })


    $scope.select = {
        value: null
    }
    $http.post('/admin/shopkeeper', {id: 0}).then(function (response2) {
        console.log("=============", response2)
        $scope.select.choices = response2.data.data;
        $scope.select.value = $scope.select.choices[0]._id;
        $scope.shopFlag = false
        $scope.loadDetail();

    })
    $scope.shop = {}
    $scope.loadDetail = function () {
        $scope.shopFlag = true
        console.log('loading', {id: $scope.select.value})
        $http.post('/admin/shopkeeper', {id: $scope.select.value}).then(function (response3) {

            console.log("fetched", response3)
            $scope.shop = response3.data.data[0];
            if (response3.data.data[0].approved == 1) {
                $scope.shop.approve = true
            } else {
                $scope.shop.approve = false

            }
            $scope.shopFlag = false


        })

    }

    $scope.changeApproval = function () {

        console.log($scope.shop.approve)

        if ($scope.shop.approve) {

            $http.get('/admin/approve?id=' + $scope.shop._id + "&approve=1").then(function (resp) {

                console.log(resp.data.data)

            })
        } else {
            $http.get('/admin/approve?id=' + $scope.shop._id + "&approve=0").then(function (resp) {

                console.log(resp.data.data)

            })
        }

    }

    $scope.editCat=function (p) {
        console.log($scope.e.newCat)
        $http.post('/admin/editCat',{id:p._id,newCat:$scope.e.newCat})
            .then(function (response) {
                if(response.data.isError){
                    Materialize.toast('error in deletion',4000)
                }else{
                    $http.post('/admin/getCat', {name: $scope.create.add1})
                        .then(function (response) {
                            if (!response.data.isError) {
                                console.log("mera data", response.data.data)
                                $scope.getData.select = response.data.data
                                Materialize.toast('Category Edited',4000)

                            }

                        })

                }

            })
        
    }
    
    
    
    $scope.updateProfile = function () {

        console.log("done update", $scope.shop)

    }


    $scope.loadSubCat = function () {


    }
    $scope.create = {}
    $scope.create.add1 = ''
    $scope.addCat = function () {
        $http.post('/admin/addCat', {name: $scope.create.add1})
            .then(function (response) {
                if (!response.data.isError) {
                    Materialize.toast("Category Added ",3000)
                    console.log(response.data)
                    $scope.create.add1 = ''
                    $http.post('/admin/getCat', {name: $scope.create.add1})
                        .then(function (response) {
                            if (!response.data.isError) {
                                console.log("mera data", response.data.data)
                                $scope.getData.select = response.data.data
                            }

                        })
                }

            })

    }


    $http.post('/admin/getCat', {name: $scope.create.add1})
        .then(function (response) {
            if (!response.data.isError) {
                console.log("mera data", response.data.data)
                $scope.getData.select = response.data.data
            }

        })

    $scope.loadSubCat = function () {
        console.log($scope.edit.selectCat)
        $http.post('/admin/getSubCat', {id: $scope.edit.selectCat})
            .then(function (response) {
                if (!response.data.isError) {
                    console.log("mera data2", response.data.data)
                    $scope.dataSaved = response.data.data
                    $scope.showList = response.data.data.subCategory

                }

            })
    }
        $scope.arrMemberAdded= [];
        $scope.arrMemberAdded1= [];

    $scope.loadContact=function(){
    $http.post('/admin/getNumber')
        .then(function (response) {
            $scope.arrMemberAdded=response.data.data
            console.log("get number",$scope.arrMemberAdded)

        })
    }
    $scope.loadContact();
       $scope.addNewMember = function(){
            console.log({
                name:$scope.dataM.name,
                number:$scope.dataM.number,
                cat:$scope.dataM.cat.category,
                sub:$scope.dataM.sub
            })
                $scope.arrMemberAdded1.push({
                    name:$scope.dataM.name,
                    number:$scope.dataM.number,
                    cat:$scope.dataM.cat.category,
                    sub:$scope.dataM.sub
                });
                $scope.dataM={}
       }
        $scope.submitMemArr=function(){
            console.log($scope.arrMemberAdded1);
           $http.post('/admin/addNumber',$scope.arrMemberAdded1)
               .then(function (response) {
                        $scope.loadContact();
               })

        }


        $scope.editNewC = function(i , obj){
             $scope.dataM = obj;
               var a = $scope.arrMemberAdded1.splice(i, 1);
        }

    $scope.editAdd = function () {
        $scope.newList.push($scope.edit.listText)
        $scope.showList.push($scope.edit.listText)

    }

    $scope.submitNew = function () {
        $http.post('/admin/addSubCat', {id: $scope.dataSaved._id, subCatArray: $scope.newList})
            .then(function (response) {
                if (!response.data.isError) {
                    console.log("mera data3", response.data.data)
                    Materialize.toast('Submited', 4000)
                }else {

                }

            })

    }

    $http.post('/admin/notificationLogs')
        .then(function (response) {
            if(response.data.isError){
                alert(response.data.msg)
            }else {
                console.log("logs",response.data.data)
                $scope.shopkeeperLogs = response.data.data[0]
                $scope.counsumerLogs = response.data.data[1]
                $scope.productLogs = response.data.data[2]
            }
        })



        $scope.saveState = false;
        $scope.categories = []
    $scope.bank={}
    $scope.bank.data={}

    $http.post('/admin/getDcat')
        .then(function (response) {
            if(response.data.isError){
                alert("error")
            }else{
                $scope.loadMe=response.data.data
            }

        })


    $scope.removeDCat=function(s){

    $http.post('/admin/removeDCat',{id:s._id})
        .then(function (response) {
            if(response.data.isError){
                Materialize.toast('error in removing',3000)
            }else{
                $http.post('/admin/getDcat')
                    .then(function (response) {
                        if(response.data.isError){
                            alert("error")
                        }else{
                            $scope.loadMe=response.data.data
                            Materialize.toast('Removed',3000)

                        }

                    })

            }
        })


    }


    $scope.changebank=function () {

            $scope.subBank=$scope.dataM.cat.subcategories
        console.log($scope.subBank)
    }

        $scope.activateSave = function(){
            $scope.saveState = true;
        };

        $scope.removeItem = function(index){
            $scope.categories.splice(index, 1);
            $scope.activateSave();
        };

        $scope.removeSub = function(obj,index){
            obj.subcategories.splice(index, 1);
            $scope.activateSave();
        };

        $scope.saveScope = function () {

            // Ajax Call to save data
            $http.post('/admin/saveDcat',{array:$scope.categories})
                .then(function (response) {
                    $http.post('/admin/getDcat')
                        .then(function (response) {
                            if(response.data.isError){
                                alert("error")
                            }else{
                                $scope.loadMe=response.data.data
                                alert("saved")
                                $scope.saveState = false;
                                $scope.categories = []
                            }

                        })



                })


        }
}])


