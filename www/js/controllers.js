var app = angular.module('app.controllers', [])

  
app.controller('recipeCardHolderCtrl', function($scope) {

})
   
.controller('loginCtrl', function ($scope, AuthService, $state) {
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

.controller('signupCtrl', function ($scope, $state, $ionicPopup, AuthService) {

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
   
app.controller('addARecipeCtrl', function ($scope, $q, $state,  MealService) {
    $scope.resetFormData = function () {
        $scope.formData = {
            'recipeName': '',
            'prepTime': '',
            'cookingTime' : '',
            'servesNMany' : '',
            'recipeDesc'  : '',
            'ingName' : '',
            'ingInstructions' :'',
            'quantity' :'',
            'measurement' :''

        };
    };
    $scope.resetFormData();


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
 