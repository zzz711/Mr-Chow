/**
 * Created by zzz711 on 2/17/16.
 */

var app = angular.module('app.controllers', ['ngCordova', 'firebase', 'nix.api'/*, 'ion-autocomplete'*/])

app.controller('addIngredientCtrl', function ($scope, $state,$http,  addIngredientService) {
  $scope.formData = {
    foodName: "",
    foodColor: "",
    foodType: "",
    fatContent: "",
    calories: "",
    protein: "",
    sugars: "",
    sodium: "",
    freshness: "",
    comments: ""
  };

  $scope.getTestItems = function (query) {
    if (query) {
      $http.get("https://api.nutritionix.com/v1_1/search/" + query + "?results=0%3A20&cal_min=0&cal_max=50000&fields=*&appId=b62a1056&appKey=0096e00788eb1a17cfe1c4c6d2008612").then(function (response) {
        var dataObject = response.data.hits;
        var dataArray = new Array;
        var i = 0;
        for (var o in response.data.hits) {
          dataArray.push(response.data.hits[o].fields);
          i = i + 1;
        }
        $scope.retArray = { items: dataArray };
        return $scope.retArray;

      });
    }
    return $scope.retArray;
  };

  $scope.itemsClicked = function (callback) {
    $scope.formData.foodName = isUndefined(callback.selectedItems[0].item_name);
    $scope.formData.foodColor = "";
    $scope.formData.foodType = "";
    $scope.formData.fatContent = isUndefined(callback.selectedItems[0].nf_total_fat);
    $scope.formData.freshness = "";
    $scope.formData.comments = "";
  };


  $scope.submit = function(form){
    console.log("FORM DATA", form);
    addIngredientService.add($scope.formData);
    clearForm(form);
    console.log("FORM DATA 2 ", form);
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
    form.calories = "";
    form.protein = "";
    form.sugars = "";
    form.sodium = "";
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
