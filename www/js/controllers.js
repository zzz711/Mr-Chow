var app = angular.module('app.controllers', [])

  
app.controller('recipeCardHolderCtrl', function($scope) {

})
   
app.controller('loginCtrl', function($scope) {
    //handles all calls to the login page. 
})
   
app.controller('signupCtrl', function($scope) {

})
      
app.controller('recipeBookCtrl', function($scope) {

})
   
app.controller('friedChickenCtrl', function($scope) {

})
   
app.controller('spaghettiCtrl', function($scope) {

})
   
app.controller('addARecipeCtrl', function ($scope, $q, $state, $cordovaCamera, MealService) {
    $scope.resetFormData = function () {
        $scope.formData = {
            'recipeName': '',
            'ingredientName': '',
            'portionSize': ''
        };
    };
    $scope.resetFormData();


    $scope.trackMeal = function (form) {
        if (form.$valid) {
            console.log($scope);
            // $ionicLoading.show();
            MealService.track($scope.formData).then(function () {
                //$scope.resetFormData();
                // $ionicLoading.hide();
                form.$setPristine(true);
                $state.go('addMedicine');
            });
        }
    };
    //todo
})
   

app.controller('dailyNutritionCtrl', function($scope) {

})
   
.controller('myMedsCtrl', function($scope) {

})
   
app.controller('addMedicineCtrl', function($scope) {

})
   
.controller('addNutritionCtrl', function($scope) {

})
   
app.controller('11/1/2015Ctrl', function($scope) {

})
   
.controller('11/2/2015Ctrl', function($scope) {

})
   
app.controller('11/3/2015Ctrl', function($scope) {

})
   
app.controller('settingsCtrl', function($scope) {

})
   
app.controller('myAccountCtrl', function($scope) {

})
   
app.controller('shareMyDataCtrl', function($scope) {

})
 