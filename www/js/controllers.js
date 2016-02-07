var app = angular.module('app.controllers', ['ngCordova', 'firebase'])


app.controller('recipeCardHolderCtrl', function($scope) {

})


app.controller('loginCtrl', function ($scope, AuthService, $state) {
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
})

app.controller('signupCtrl', function ($scope, $state, $ionicPopup, AuthService) {

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


app.controller('recipeBookCtrl', function($scope) {

})

app.controller('friedChickenCtrl', function($scope) {

})

app.controller('spaghettiCtrl', function($scope) {

})


app.controller('addIngredientCtrl', function ($scope, $state,$http,  addIngredientService) {
    $scope.$on('$ionicView.enter', function () {
    $scope.initialize = addIngredientService.getSpecificIngredient();
        console.log("INITIALIZE IS ", $scope.initialize);
        $scope.measurement =  $scope.initialize.measurement;
    });

    $scope.doStuff = function () {
            // $ionicLoading.show();
            addIngredientService.setIngredient($scope.initialize, $http);
            $scope.initialize = addIngredientService.setEmpty();
            $state.go('main.addARecipe');
    };

})

app.controller('addARecipeCtrl',  function ($scope, $q, $state, $cordovaCamera, $firebaseArray, addIngredientService, MealService, addRecipeFirebaseService) {
    $scope.resetFormData = function () {
        $scope.formData = {
            'recipeName': '',
            'prepTime': '',
            'cookingTime' : '',
            'servesNMany' : '',
            'recipeDesc': '',
            'ingPassed':''
        };
    };
    $scope.resetFormData();

    $scope.ingredient = function () {
        $scope.retVals = addIngredientService.getAllIngredient();
    };

    $scope.setRemove = function (value) {
        $scope.retVals = addIngredientService.deleteSpecificIngredient(value);
    }

    $scope.setFill = function (value) {
        addIngredientService.setSpecificIngredient(value);
        $state.go('addAnIngredient', {}, { reload: true });
    };
    $scope.setNew = function () {
        addIngredientService.setEmpty();
        $state.go('addAnIngredient', {}, { reload: true });
    }

    $scope.trackMeal = function (form) {
        if (form.$valid) {
            // $ionicLoading.show();
            $scope.retVals = addIngredientService.getAllIngredient();
            console.log($scope.retVals);
            addRecipeFirebaseService.saveRecipe(form, $scope.retVals);
                $state.go('main.recipeBook');
                $scope.retVals = "";
                addIngredientService.resetArray();
                console.log($scope.retVals);

        }
    };

   $scope.addPicture = function () {
        var options = {
        	quality: 50,
        	destinationType: Camera.DestinationType.DATA_URL,
        	sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            //IN PROD -sourceType: Camera.PictureSourceType.CAMERA
        	allowEdit: true,
        	encodingType: Camera.EncodingType.JPEG,
        	targetWidth: 480,
        	popoverOptions: CameraPopoverOptions,
        	saveToPhotoAlbum: false
       };


        $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.formData.picture = imageData;
        }, function (err) {
            console.error(err);
        });
       }


})

app.controller('dailyNutritionCtrl', function($scope){
  $scope.formData ={
    mealName: "",
    mealContents: "",
    foodType: "",
    date: "",
    comments: ""
  };

  $scope.addNewDailyNutrition = function(){
    //console.log("Function");


    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1; //month starts at 0
    var day = today.getDate();

    today = month + "/" + day + "/" + year;
    console.log(today);

    $state.go("addNutrition");
  };
})


.controller('myMedsCtrl', function($scope) {

})

app.controller('addMedicineCtrl', function($scope) {

})

.controller('addNutritionCtrl', function($scope) {
  console.log("Add Nutrition");

  $scope.formData = {
    "searchResults": "",
    "meal": "",
    "servings" : "",
    "calories": ""
  };

  $scope.logNutrition = function(form){
    console.log($scope.formData.meal);
    console.log($scope.formData.servings);
    console.log($scope.formData.calories);

    nutritionService
  }
})

app.controller('11/1/2015Ctrl', function($scope) {

})

.controller('11/2/2015Ctrl', function($scope) {

})

app.controller('11/3/2015Ctrl', function($scope) {

})

app.controller('settingsCtrl', function($scope, $state) {
  $scope.changePW = function (){
    $state.go("changePW");
  }

})

app.controller('myAccountCtrl', function($scope) {

})

app.controller('shareMyDataCtrl', function($scope) {

})

app.controller('changePWCtrl', function($scope, $ionicPopup, $state){
  $scope.formData = {
    password: "",
    newPassword: "",
    confirmNewPassword: ""
  };

  $scope.changePW = function(form) {
    if (form.$valid) {
      if ($scope.formData.newPassword === $scope.formData.confirmNewPassword) {
        var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");
        var user = fbUser.getAuth();

        fbUser.changePassword({
          email: user.password.email,
          oldPassword: $scope.formData.password,
          newPassword: $scope.formData.newPassword
        }).then(function () {
          $ionicPopup.alert({
            title: "Password Changed"
          });
          $state.go("main.recipeBook");
          form.$setPristine();
        }).catch(function (error) {
          console.log(error);

          if (user.password != $scope.formData.password) {
            $ionicPopup.alert({
              title: "Password is not correct",
              template: "The password you have entered is incorrect. Please try again"
            });
          }

        })
      }

      else {
        $ionicPopup.alert({
          title: "An Error has Occurred",
          template: "Please make sure all fields are filled out and are at least six characters in length"
        });
      }
    }
  }

})
