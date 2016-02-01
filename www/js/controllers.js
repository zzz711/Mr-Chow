var app = angular.module('app.controllers', ['ngCordova'])

  
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
        Parse.User.logOut();
        Parse.User.requestPasswordReset($scope.formData.email, {
            success: function () {
                $ionicPopup.alert({
                    title: "Passowrd Reset has been Emailed"
                })
            },
            error: function (error) {
                // Show the error message somewhere
                console.log(error);
            }
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
            Parse.User.logOut();
            AuthService.signup($scope.formData.name, $scope.formData.email, $scope.formData.password);
        }

        else {
            console.log("Invalid form");
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

app.controller('addARecipeCtrl',  function ($scope, $q, $state, $cordovaCamera, addIngredientService, MealService) {
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
           
            MealService.track($scope.formData).then(function () {
                //$scope.resetFormData();
                // $ionicLoading.hide();
                form.$setPristine(true);
            
                $state.go('main.recipeBook');
            });
            
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
 