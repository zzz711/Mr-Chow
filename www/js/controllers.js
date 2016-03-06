var app = angular.module('app.controllers', ['ngCordova', 'firebase', 'nix.api', 'ion-autocomplete'])


app.controller('recipeCardHolderCtrl', function ($scope, AuthService, $state) {
    $scope.login = function () {
        if (AuthService.getUser()) {
            $state.go("main.recipeBook");
        }
        else {
            $state.go("login");
        }
    }

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

      //TODO: clear form
        form.email = "";
        form.password = "";
        AuthService.login($scope.formData.email, $scope.formData.password);
    };

    $scope.reset = function () {
        var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");
        fbUser.resetPassword({
            email: $scope.formData.email
        }).then(function () {
            $ionicPopup.alert({
                title: "Password Reset has been Emailed"
            })
        }).catch(function (error) {
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
            form.name = null; //null or empty string?
            form.email = "";
            form.password = "";
            form.confirmPassword = "";
            AuthService.signup($scope.formData.name, $scope.formData.email, $scope.formData.password);
        }

        else if ($scope.formData.password != $scope.formData.confirmPassword) {
            $ionicPopup.alert({
                title: "Passwords Do Not Match"
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




app.controller('friedChickenCtrl', function ($scope) {

})

app.controller('spaghettiCtrl', function ($scope) {

})


app.controller('addIngredientCtrl', function ($scope, $state, $http, addIngredientService) {
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


    $scope.submit = function(form) {
      console.log("FORM DATA", form);
      addIngredientService.add($scope.formData);
      clearForm(form);
      console.log("FORM DATA 2 ", form);
      $state.go("addNutrition");
    };

    $scope.submit = function (form) {
        console.log("FORM DATA", form);
        addIngredientService.add($scope.formData);
        clearForm(form);
        console.log("FORM DATA 2 ", form);
        $state.go(addIngredientService.getPageCalled());
    };

    $scope.addIngredient = function (form) {
        addIngredientService.add($scope.formData);
        //console.log($scope.formData);

        //TODO: find a way to clear the form


      form.$setPristine();
      form.$setUntouched();
      clearForm(form)
    };

    var clearForm = function (form) {
      console.log("clear");
      form.foodName = "";
      form.foodColor = "";
      form.foodType = "";
      form.fatContent = "";
      form.freshness = "";
      form.comments = "";
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


})


app.controller('addIngredientRecipeCtrl', function ($scope, $window, $state, $http, nixApi, addIngredientService) {
    $scope.initialize = {
        calories: "",
        comments: "",
        fatContent: "",
        foodColor: "",
        freshness: "",
        id: "",
        ingName: "",
        protein: "",
        quantity: "",
        sodium: "",
        sugars: ""
    };
    $scope.retValue = "";
    $scope.model = "";

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
        $scope.initialize = addIngredientService.setPageVals(callback.selectedItems[0]);
    };

    $scope.$on('$ionicView.enter', function () {
        $scope.initialize = addIngredientService.getSpecificIngredient();
        $scope.measurement = $scope.initialize.measurement;
    });

    $scope.doStuff = function () {
        // $ionicLoading.show();
        addIngredientService.setIngredient($scope.initialize, $http);
        addIngredientService.totalContentsAdd($scope.initialize, $http);
        $scope.initialize = addIngredientService.setEmpty();
        $state.go(addIngredientService.getPageCalled(), {}, { reload: true });
    };
})



app.controller('addARecipeCtrl', function ($scope, nixApi, $q, $http, $state, $window, $ionicPopover, $cordovaCamera, addIngredientService, addToFirebaseService) {
    $scope.retVals = "";
    $scope.totalVal = addIngredientService.getTotalContents($http);


    $scope.ingredient = function () {
        $scope.retVals = addIngredientService.getAllIngredient();
        $scope.totalVal = addIngredientService.getTotalContents($http);
    };

    $scope.setRemove = function (value) {
        $scope.retVals = addIngredientService.deleteSpecificIngredient(value);
        $scope.totalVal = addIngredientService.totalContentsSub(value);
    };


    $scope.setFill = function (value) {
        addIngredientService.setSpecificIngredient(value);
        addIngredientService.setPageCalled('main.addARecipe');
        $state.go('addAnIngredientRecipe', {}, { reload: true });
    };

    $scope.setNew = function () {
        addIngredientService.setEmpty();
        addIngredientService.setPageCalled('main.addARecipe');
        $state.go('addAnIngredientRecipe', {}, { reload: true });
    };

    $scope.trackMeal = function (form) {
        if (form.$valid) {
            $scope.retVals = addIngredientService.getAllIngredient();
            addToFirebaseService.saveRecipe(form, $scope.retVals);

            form.recipeName = "";
            form.recipeDesc = "";
            form.servesNMany = "";
            form.prepTime = "";
            form.cookingTime = "";
            $scope.initialize = {}
            addIngredientService.setEmpty();
            addIngredientService.resetArray();
            addIngredientService.setTotalEmpty();
            $state.go('main.recipeBook', {}, { reload: true });
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
            console.error("yolo ", err);
        });
    };


})




.controller('myMedsCtrl', function ($scope, $state, medicineService) {

})

app.controller('addMedicineCtrl', function ($scope, medicineService, $state) {
    $scope.addMed = {
        medicineName: "",
        amount: "",
        taken: "",
        extra: ""
    };


    $scope.addMedication = function () { //wasn't getting called so I made a new function do the same thin
        console.log($scope.addMed);
        medicineService.add($scope.addMed);
        $state.go("main.myMeds");
    }





})

.controller('addNutritionCtrl', function ($scope, $http, $state, addIngredientService, addToFirebaseService) {
    $scope.formData = {
        mealName: "",
        mealContents: "",
        foodType: "",
        date: "",
        time: "",
        comments: ""
    };

    $scope.returnVals = "";
    $scope.totalVal = addIngredientService.getTotalContents($http);

    $scope.mealInfo = function () {
        $scope.returnVals = addIngredientService.getAllIngredient();
        $scope.totalVal = addIngredientService.getTotalContents($http);
    };

    $scope.setRemove = function (value) {
        $scope.returnVals = addIngredientService.deleteSpecificIngredient(value);
        $scope.totalVal = addIngredientService.totalContentsSub(value);
    };

    $scope.setFill = function (value) {
        addIngredientService.setSpecificIngredient(value);
        addIngredientService.setPageCalled("addNutrition");
        $state.go('addAnIngredientRecipe', {}, { reload: true });
    };

    $scope.setNew = function () {
        addIngredientService.setEmpty();
        addIngredientService.setPageCalled("addNutrition");
        $state.go('addAnIngredientRecipe', {}, { reload: true });
    };

    $scope.addNewDailyNutrition = function (form) {
        if (form.$valid) {
            //MealService.add($scope.formData);
            addToFirebaseService.saveNutrition($scope.formData, addIngredientService.getAllIngredient());
            addIngredientService.setTotalEmpty();
            $state.go("main.dailyNutrition", {}, { reload: true });
        }
        else {
            console.log("Form is not valid")
        }
    };

    $scope.addIngredient = function (form) {
            // MealService.add($scope.formData);
            addIngredientService.setEmpty();
            addIngredientService.setPageCalled("addNutrition");
            $state.go('addAnIngredientRecipe', {}, { reload: true });
    };

    $scope.scanBarcode = function () {
        $cordovaBarcodeScanner.scan().then(function (imageData) {
            alert(imageData.text);
            console.log("Barcode Format " + imageData.format);
        }, function (error) {
            console.log("An error happened -> " + error);
        });
    };

    function clear(form) {
        form.mealName = "";
        form.mealContents = "";
        form.foodType = "";
        form.date = "";
        form.time = "";
        form.comments = "";
    }
})


app.controller('11/1/2015Ctrl', function ($scope) {

})

.controller('11/2/2015Ctrl', function ($scope) {

})

app.controller('11/3/2015Ctrl', function ($scope) {

})

app.controller('settingsCtrl', function ($scope, $state, AuthService) {
    $scope.changePW = function () {
        $state.go("changePW");
    };

    $scope.logOut = function () {
        AuthService.logOut();
        $state.go("recipeCardHolder");
    };

})

app.controller('myAccountCtrl', function($scope, $ionicPopup, AuthService, $state) {
  $scope.formData = {
    email: ""
  };

  $scope.$on('$ionicView.enter', function () {
    $scope.setEmail = function () {
      console.log("current email");
      //$document.getElementById("currentEmail").textContent = AuthService.getEmail();
      $scope.currentEmail = AuthService.getEmail();

    }
  });

  $scope.submit = function(form) {
    $scope.data = {};
      //TODO: use an ionic popup show to get password
    var passwrd = $ionicPopup.show({
      template: '<input type="password" ng-model="data.password">',
      title: "Please Enter Your Password",
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Enter</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.password) {
              e.preventDefault();
            }
            else{
            //TODO clear form
  //            form.email = "";
              AuthService.changeEmail($scope.formData.email, $scope.data.password);

            }

            }
          }
        ]
      });
    }


})

app.controller('shareMyDataCtrl', function ($scope) {

})

app.controller('changePWCtrl', function ($scope, $ionicPopup, $state, AuthService) {
    $scope.formData = {
        password: "",
        newPassword: "",
        confirmNewPassword: ""
    };



    $scope.changePW = function (form) {
        if ($scope.formData.newPassword === $scope.formData.confirmNewPassword) {
            AuthService.changePW($scope.formData);
            $state.go("login");
        }
        else if ($scope.formData.newPassword != $scope.formData.confirmNewPassword) {
            $ionicPopup.alert({
                title: "New Passwords Do Not Match"
            });
        }

        else {
            $ionicPopup.alert({
                title: "An Error has Occurred",
                template: "Please make sure all fields are filled out and are at least six characters in length"
            });
        }
    };




})

app.controller('recipeBookCtrl', function ($scope, RecipeService) {
  
})

app.controller('recipeBookCtrl', function ($scope, pullRecipeFirebaseService, RecipeService) {
    $scope.retVals2 = pullRecipeFirebaseService.pullRecipe().then(function (result) {
        $scope.retVals2 = $scope.retVals = result; 
    });
    $scope.$watch('search', function (newValue) {
        if (newValue) {
            $scope.retVals2 = $scope.retVals.filter(function (recipe) { return recipe.recipeName.indexOf(newValue) != -1; });
        }
        else {
            $scope.retVals2 = $scope.retVals;
        }
    });

    $scope.deleteRecipe = function (obj) {
        console.log(obj);
        RecipeService.deleteRecipe(obj);
    }
})

app.controller('medPullCtrl', function ($scope,$state, medicineService, pullMedsFirebaseService) {
    $scope.retVals2 = pullMedsFirebaseService.pullMeds().then(function (result) {
        $scope.retVals = result;
    });
    $scope.medPage = function () {
        $state.go("addMedicine");
    }

    $scope.addMeds = function () {
        $state.go("addMedicine");
    };

    $scope.deleteMeds = function (obj) {
        console.log(obj);
        medicineService.deleteMeds(obj);
    }
})


app.controller('dailyNutritionCtrl', function ($scope, addIngredientService) {
    $scope.setRemove = function (guid) {
        console.log(guid.id);
        addIngredientService.deleteMeal(guid);
        //TODO: refresh list
    }

})
app.controller('nutritionCtrl', function ($scope, pullNutritionFirebaseService) {
    $scope.retVals2 = pullNutritionFirebaseService.pullNutrition().then(function (result) {
        $scope.retVals = result;
    });
})
