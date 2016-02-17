/**
 * Created by zzz711 on 2/17/16.
 */

var app = angular.module('app.controllers', ['ngCordova', 'firebase', 'nix.api'/*, 'ion-autocomplete'*/])

app.controller('addIngredientCtrl', function ($scope, $state,$http,  addIngredientService) {
  console.log("add ingredient");

  $scope.formData = {
    foodName: "",
    foodColor: "",
    foodType: "",
    fatContent: "",
    freshness: "",
    comments: ""
  };

  $scope.submit = function(form){
    console.log($scope.formData);
    addIngredientService.add($scope.formData);
    $state.go("main.dailyNutrition");
  };

  $scope.addIngredient = function(form){
    addIngredientService.add($scope.formData);
    //console.log($scope.formData);

    //TODO: find a way to clear the form

    form.$setPristine();
    clearForm(form)
  };

  var clearForm =function(form){
    console.log("clear");
    form.foodName = "";
    form.foodColor = "";
    form.foodType = "";
    form.fatContent = "";
    form.freshness = "";
    form.comments = "";
  };

  //$scope.$on('$ionicView.enter', function () {
  //$scope.initialize = addIngredientService.getSpecificIngredient();
  //    console.log("INITIALIZE IS ", $scope.initialize);
  //    $scope.measurement =  $scope.initialize.measurement;
  //});
  //
  //$scope.doStuff = function () {
  //        // $ionicLoading.show();
  //        addIngredientService.setIngredient($scope.initialize, $http);
  //        $scope.initialize = addIngredientService.setEmpty();
  //        $state.go('main.addARecipe');
  //};

})
