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
        "password": "",
        "confirmPassword": ""
    };

    $scope.signUp = function (form) {
        console.log("loginCtrl::signUp");

        if (form.$valid && $scope.formData.password === $scope.formData.confirmPassword) {
            //console.log("uncomment parse code");
            AuthService.signup($scope.formData.name, $scope.formData.email, $scope.formData.password);
        }

        else if($scope.formData.password != $scope.formData.confirmPassword){
          $ionicPopup.alert({
            title:"Passwords Do Not Match",
          })
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
      //addIngredientService.add($scope.formData, 1);
      $state.go("main.dailyNutrition");
    };

    $scope.addIngredient = function(form){
      console.log("addIng");
      //addIngredientService.add($scope.formData);
      console.log($scope.formData);
      clearForm(form)
    };

    var clearForm =function(form){
      console.log("clear");
      $scope.form.foodName = "";
      $scope.form.foodColor = "";
      $scope.form.foodType = "";
      $scope.form.fatContent = "";
      $scope.form.freshness = "";
      $scope.form.comments = "";
    };

    //$scope.$on('$ionicView.enter', function () {
    //$scope.initialize = addIngredientService.getSpecificIngredient();
    //    console.log("INITIALIZE IS ", $scope.initialize);
    //    $scope.measurement =  $scope.initialize.measurement;
    //});

    //$scope.doStuff = function () {
    //        // $ionicLoading.show();
    //        addIngredientService.setIngredient($scope.initialize, $http);
    //        $scope.initialize = addIngredientService.setEmpty();
    //        $state.go('main.addARecipe');
    //};

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

})


.controller('myMedsCtrl', function($scope, $state) {
  $scope.addMeds = function(){
    $state.go("addMedicine")
  }
})

app.controller('addMedicineCtrl', function($scope, medicineService, $state) {
  console.log("add meds");
  $scope.formData = {
    medicineName: "",
    amount: "",
    taken: "",
    extra: ""
  }


  $scope.logMedication = function(){
    console.log($scope.formData);
    medicineService.add($scope.formData);
    $state.go("main.myMeds");
  }

})

.controller('addNutritionCtrl', function($scope, $state, MealService) {
  console.log("Add Nutrition");

  $scope.formData ={
    mealName: "",
    mealContents: "",
    foodType: "",
    date: "",
    time: "",
    comments: ""
  };

  $scope.addNewDailyNutrition = function(form){
    console.log($scope.formData);
    if(form.$valid) {
      MealService.add($scope.formData);
      $state.go("main.dailyNutrition");
    }
    else{
      console.log("Form is not valid")
    }

  };

  $scope.addIngredient = function(form){
    if(form.$valid) {
      // MealService.add($scope.formData);
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
          fbUser.unauth(); //will this cause an error?
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
