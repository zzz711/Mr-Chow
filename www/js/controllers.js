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


app.controller('addIngredientRecipeCtrl', function ($scope, $window, $state, $http, nixApi, addIngredientService, pullRecipeIngredientFirebaseService) {
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
    $scope.recipeIngredients = pullRecipeIngredientFirebaseService.pullRecipeIngredients().then(function (result) {
        $scope.recipeIngredients = result.map(function (recipeIngredient) {
            recipeIngredient.item_name = recipeIngredient.ingName;
            return recipeIngredient;
        });
    });

    $scope.getTestItems = function (query) {
        if (query) {
            $http.get("https://api.nutritionix.com/v1_1/search/" + query + "?results=0%3A20&cal_min=0&cal_max=50000&fields=*&appId=b62a1056&appKey=0096e00788eb1a17cfe1c4c6d2008612").then(function (response) {
                $scope.retArray = { items: [] };
                if ($scope.recipeIngredients) {
                    var matchingRecipeIngredients = $scope.recipeIngredients.filter(function (recipeIngredient) {
                        return recipeIngredient.ingName && recipeIngredient.ingName.toLowerCase().indexOf(query.toLowerCase()) != -1;
                    });
                    matchingRecipeIngredients = matchingRecipeIngredients.slice(0, matchingRecipeIngredients.length < 20 ? matchingRecipeIngredients.length : 20);
                    $scope.retArray.items = $scope.retArray.items.concat(matchingRecipeIngredients);
                }

                var dataObject = response.data.hits;
                var dataArray = new Array;
                var i = 0;
                for (var o in response.data.hits) {
                    dataArray.push(response.data.hits[o].fields);
                    i = i + 1;
                }
                $scope.retArray.items = $scope.retArray.items.concat(dataArray);
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
            addToFirebaseService.saveRecipe(form, $scope.retVals, $scope.totalVal);

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

    $scope.addMedication = function () { 
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
            addToFirebaseService.saveNutrition($scope.formData, addIngredientService.getAllIngredient());
            addIngredientService.setTotalEmpty();
            $state.go("main.dailyNutrition", {}, { reload: true });
        }
        else {
            console.log("Form is not valid")
        }
    };

    $scope.addIngredient = function (form) {
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



app.controller('settingsCtrl', function ($scope, $state, AuthService) {
    $scope.changePW = function () {
        $state.go("changePW");
    };

    $scope.logOut = function () {
        AuthService.logOut();
        $state.go("recipeCardHolder");
    };

})

app.controller('myAccountCtrl', function ($scope, $ionicPopup, AuthService, $state) {
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

    $scope.submit = function (form) {
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
                  onTap: function (e) {
                      if (!$scope.data.password) {
                          e.preventDefault();
                      }
                      else {
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
            $scope.retVals2 = $scope.retVals.filter(function (recipe) { return recipe.recipeName.toLowerCase().indexOf(newValue.toLowerCase()) != -1; });
        }
        else {
            $scope.retVals2 = $scope.retVals;
        }
    });

    $scope.deleteRecipe = function (obj) {
        RecipeService.deleteRecipe(obj);
    }
})

app.controller('medPullCtrl', function ($scope, $state, medicineService, pullMedsFirebaseService) {
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
        medicineService.deleteMeds(obj);
    }
})


app.controller('dailyNutritionCtrl', function ($scope, addIngredientService) {
    $scope.setRemove = function (guid) {
        addIngredientService.deleteMeal(guid);
    }
})

app.controller('nutritionCtrl', function ($scope, pullNutritionFirebaseService) {
    $scope.retVals2 = pullNutritionFirebaseService.pullNutrition().then(function (result) {
        console.log(typeof(result));
        $scope.retVals = result;
    });
})
