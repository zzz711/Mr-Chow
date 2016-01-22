angular.module('app.controllers', [])

.controller('recipeCardHolderCtrl', function($scope) {
  /*
  Parse test code
  var TestObject = Parse.Object.extend("TestObject");
  var testObject = new TestObject();
  testObject.save({foo: "bar"}).then(function(object) {
    alert("yay! it worked");
  });
  */
})

.controller('loginCtrl', function($scope, AuthService, $state) {
  console.log("loginCtrl::log");

  $scope.formData = {
    "email": "",
    "password": ""
  };

  $scope.login = function(form) {
    console.log("loginCtrl::login");

        //console.log("uncomment parse code");
        AuthService.login($scope.formData.email, $scope.formData.password);
    }


})

.controller('signupCtrl', function($scope, $state, $ionicPopup, AuthService) {

  $scope.formData = {
    "name": "",
    "email": "",
    "password": ""
  };

  $scope.signUp = function(form) {
    console.log("loginCtrl::signUp");

    if(form.$valid){
      //console.log("uncomment parse code");
      AuthService.signup($scope.formData.name, $scope.formData.email, $scope.formData.password);
      $ionicPopup.alert({
        title:"Account Created",
        subtitle:"Your account has been successfully created."
      });
      $state.go("login");
    }

    else{
      console.log("Invalid form");
    }
  }


})

.controller('recipeBookCtrl', function($scope) {



})

.controller('friedChickenCtrl', function($scope) {

})

.controller('spaghettiCtrl', function($scope) {

})

.controller('addARecipeCtrl', function($scope) {

})

.controller('dailyNutritionCtrl', function($scope) {

})

.controller('myMedsCtrl', function($scope) {

})

.controller('addMedicineCtrl', function($scope) {

})

.controller('addNutritionCtrl', function($scope) {

})

.controller('11/1/2015Ctrl', function($scope) {

})

.controller('11/2/2015Ctrl', function($scope) {

})

.controller('11/3/2015Ctrl', function($scope) {

})

.controller('settingsCtrl', function($scope) {

})

.controller('myAccountCtrl', function($scope) {

})

.controller('shareMyDataCtrl', function($scope) {

});

