/**
 * Created by zzz711 on 1/18/16.
 */

var app = angular.module('app.controllers.signupCtrl', [])

pp.controller('signupCtrl', function ($scope, $state, $ionicPopup, AuthService) {

  $scope.formData = {
    "name": "",
    "email": "",
    "password": ""
  };

  $scope.signUp = function (form) {
    console.log("loginCtrl::signUp");

    if (form.$valid) {
      //console.log("uncomment parse code");
      AuthService.signup($scope.formData.name, $scope.formData.email, $scope.formData.password);
    }

    else {
      console.log("Invalid form");
      $ionicPopup.alert({
        title: "Form Error",
        template: "An error has occurred. Please make sure all fields are filled out, your email is formatted correctly and your password is at least 6 characters in length."
      })
    }
  }


})
