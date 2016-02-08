/**
 * Created by zzz711 on 1/18/16.
 */

var app = angular.module('app.controllers.loginCtrl', [])

app.controller('loginCtrl', function($scope, $state, AuthService){
  console.log("loginCtrl::log");

  $scope.formData = {
    "email": "",
    "password": ""
  };

  $scope.login = function (form) {
    console.log("loginCtrl::login");

    //console.log("uncomment parse code");
    AuthService.login($scope.formData.email, $scope.formData.password);
  }

  $scope.reset = function () {
    var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");
    fbUser.resetPassword({
      email: $scope.formData.email
    }).then(function(){
      $ionicPopup.alert({
        title: "Passowrd Reset has been Emailed"
      })
    }).catch(function(error){
      console.log(error);
    });

  }
});

