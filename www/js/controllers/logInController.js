/**
 * Created by zzz711 on 1/18/16.
 */

var app = angular.module('app.controllers.recipeBookCtrl', [])

app.controller('recipeBookCtrl', function($scope, $state, AuthService){
  $scope.formData = {
    "email": "",
    "password": ""
  };

  $scope.login = function (form){
    if(form.$valid){
      //TODO: check that email and password match
      console.log("recipeBookCtrl::login");
    }
    else{
      console.log("Invalid Form");
    }

  }
});

