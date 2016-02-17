/**
 * Created by zzz711 on 2/7/16.
 */

var app = angular.module('app.controllers', ['ngCordova', 'firebase'])

app.controller('addNutritionCtrl', function($scope, $state) {
  $scope.formData ={
    mealName: "",
    mealContents: "",
    foodType: "",
    date: "",
    time: "",
    comments: ""
  };

  $scope.addNewDailyNutrition = function(form){
    if(form.$valid) {
      MealService.add($scope.formData);
      //TODO: clear form
      clear(form);
      $state.go("main.dailyNutrition");
    }
    else{
      console.log("Form is not valid")
    }

  };

  $scope.addIngredient = function(form){
    if(form.$valid) {
      MealService.add($scope.formData);
      //TODO: clear form
      form.$setUntouched();
      clear(form);
      $state.go("addAnIngredient");
    }
    else {
      console.log("Form is not valid");
    }
  };

  $scope.scanBarcode = function () {
    $cordovaBarcodeScanner.scan().then(function (imageData) {
      alert(imageData.text);
      console.log("Barcode Format " + imageData.format);
      //console.log("Cancelled " + imageData.cancelled);
    }, function (error) {
      console.log("An error happened -> " + error);
    });
  };

  function clear(form){
    form.mealName = "";
    form.mealContents = "";
    form.foodType = "";
    form.date = "";
    form.time = "";
    form.comments = "";
  }
})
