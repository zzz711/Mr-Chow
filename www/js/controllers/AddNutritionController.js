/**
 * Created by zzz711 on 2/7/16.
 */

var app = angular.module('app.controllers', ['ngCordova', 'firebase'])

app.controller('addNutritionCtrl', function($scope, $state) {
  console.log("Add Nutrition");

  $scope.formData ={
    mealName: "",
    mealContents: "",
    foodType: "",
    date: "",
    time: "",
    comments: ""
  };

  $scope.addNewDailyNutrition = function(){
    console.log("Add new daily Nutrition");
    MealService.add($scope.formData);
    $state.go("main.dailyNutrition");

  };

  $scope.addIngredient = function(){
    console.log("Add new ingredient");
    MealService.add($scope.formData);
    $state.go("addAnIngredient");
  };
})
