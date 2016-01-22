/**
 * Created by zzz711 on 1/18/16.
 */

var app = angular.module('app.controllers.signupCtrl', [])

app.controller('signupCtrl', function($scope, $state, AuthService){
  $scope.formData = {
    "name": " ",
    "email": " ",
    "password": " "
  }

  $scope.signup = function( form ) {
    if(form.$valid){

    }
  }
});
