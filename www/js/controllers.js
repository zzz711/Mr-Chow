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

app.controller('loginCtrl', function ($scope, AuthService) {
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

app.controller('myAccountCtrl', function ($scope, $ionicPopup, AuthService, $state) {
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });

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

app.controller('settingsCtrl', function ($scope, $state, AuthService) {
    $scope.changePW = function () {
        $state.go("changePW");
    };

    $scope.logOut = function () {
        AuthService.logOut();
        $state.go("recipeCardHolder");
    };

})

app.controller('shareMyDataCtrl', function ($scope, $cordovaSocialSharing, NutritionService, medicineService, RecipeService, $state, $cordovaEmailComposer) {
    $scope.formData = {
        NutritionInfo: false,
        MedInfo: false,
        RecipeInfo: false,
        StartDate: null,
        EndDate: null,
        recipient: ""

    };


    $scope.shareData = function () {
        var message = "";

        if ($scope.formData.NutritionInfo) {
            NutritionService.getNutrition($scope.formData.StartDate, $scope.formData.EndDate, function (data) {
                if (data.length > 0) {
                    message += "Meals:<br>"
                }
                for (var i = 0; i < data.length; ++i) {
                    message += "Meal Name: " + data[i].mealName + "<br>";
                    message += "Meal Type: " + data[i].meal + "<br>";
                    message += "Date: " + data[i].date + "<br>";
                    message += "Time: " + data[i].time + "<br>";
                    message += "Totals for meal:<br>";
                    message += "Calories: " + data[i].totalCal + "<br>";
                    message += "Protein: " + data[i].totalProtein + "<br>";
                    message += "Sugars: " + data[i].totalSugars + "<br>";
                    message += "Sodium: " + data[i].totalSodium + "<br>";
                    message += "Fat Content: " + data[i].totalFat + "<br><br>";
                }
            });
        }

        if ($scope.formData.MedInfo) {
            medicineService.getMeds(function (data) {
                if (data.length > 0) {
                    message += "Medicine:<br>"
                }
                for (var i = 0; i < data.length; i++) {
                    message += "Medicine Name: " + data[i].name + "<br>";
                    message += "Amount Per Serving: " + data[i].amount + "<br>";
                    message += "Taken: " + data[i].taken + "<br>";
                    message += "Extra Info: " + data[i].extra + "<br>< br >";
                }
            });
        }

        if ($scope.formData.RecipeInfo) {
            RecipeService.getRecipe(function (data) {
                if (data.length > 0) {
                    message += "Recipes:<br>"
                }
                for (var i = 0; i < data.length; i++) {
                    message += "Recipe Title: " + data[i].recipeName + "<br>";
                    message += "Prep Time: " + data[i].prepTime + "<br>";
                    message += "Cooking Time: " + data[i].cookingTime + "<br>";
                    message += "Serves: " + data[i].servesNMany + "<br>";
                    message += "Picture: <img src='" + Base64.decode(data[i].picture) + "' height=200px width=200px /> <br>";
                    message += "Totals for meal:<br>";
                    message += "Calories: " + data[i].totalCal + "<br>";
                    message += "Protein: " + data[i].totalProtein + "<br>";
                    message += "Sugars: " + data[i].totalSugars + "<br>";
                    message += "Sodium: " + data[i].totalSodium + "<br>";
                    message += "Fat Content: " + data[i].totalFat + "<br>";
                    message += "<br>";
                }
            });
        }

        $scope.sendEmail(message);
    };
    $scope.sendEmail = function (message) {
        var subject = "";
        var recipient = $scope.formData.recipient;
        var ccArr = null;
        var bccArr = null;
        var file = null;

        $cordovaSocialSharing.shareViaEmail(JSON.stringify(message), subject, recipient, ccArr, bccArr, file)
          .then(function (result) {
              console.log("Success!");
          }, function (err) {
              console.log(err);

          });
    }
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


//MEDICINE CONTROLS
app.controller('addMedicineCtrl', function ($scope, $ionicPopup, medicineService, $state) {
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });

    $scope.addMed = {
        medicineName: "",
        amount: "",
        taken: "",
        extra: ""
    };
    $scope.addMedication = function () {
        if ($scope.addMed.medicineName == "") {
            $ionicPopup.alert({
                title: 'Oh No! You missed something.',
                template: 'Please add a medicine name.'
            });
        }
        else {
            $scope.medicineName = "";
            $scope.amount = "";
            $scope.taken = "";
            $scope.extra = "";
            medicineService.add($scope.addMed);
            $state.go("main.myMeds");
        }
    }
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

app.controller('medPullCtrl', function ($scope, $state, medicineService, addIngredientService, pullMedsFirebaseService) {
    $scope.retVals2 = pullMedsFirebaseService.pullMeds().then(function (result) {
        $scope.retVals = result;
    });
    $scope.medPage = function () {
        $state.go("addMedicine");
    }

    $scope.addMeds = function () {
        addIngredientService.setedit(0);
        $state.go("addMedicine");
    };

    $scope.deleteMeds = function (obj) {
        medicineService.deleteMeds(obj);
    }

    $scope.editMeds = function (obj) {
        addIngredientService.setedit(1);
        medicineService.setViewingMed(obj);
        $state.go("addMedicine");
    }

})



//RECIPE CONTROLS
app.controller('recipeBookCtrl', function ($scope, $state, pullRecipeFirebaseService, addIngredientService, RecipeService) {

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

    $scope.addNewRecipe = function (obj) {
        RecipeService.setViewingRecipe(null);
        addIngredientService.setedit(1);
        $state.go("addARecipe");
    }

    $scope.deleteRecipe = function (obj) {
        RecipeService.deleteRecipe(obj);
        addIngredientService.setedit(0);
    }

    $scope.editRecipe = function (obj) {
        RecipeService.setViewingRecipe(obj);
        addIngredientService.setedit(0);
        $state.go("addARecipe");
    }

    $scope.viewRecipe = function (obj) {
        addIngredientService.setedit(0);
        RecipeService.setViewingRecipe(obj);
        $state.go('viewRecipe', {}, { reload: true });
    }
})

app.controller('addIngredientRecipeCtrl', function ($timeout, $scope, $ionicPopup, $cordovaBarcodeScanner, $rootScope, $state, $http, nixApi, addIngredientService, pullRecipeIngredientFirebaseService, pullRecipeFirebaseService) {
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });

    $scope.vm = "";
    $scope.scanResults = '';

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

    $scope.scan = function(){
        $timeout(function() {
            $cordovaBarcodeScanner.scan().then(function(result) {
                $http.get("https://api.nutritionix.com/v1_1/item?upc=" + result.text + "&appId=b62a1056&appKey=0096e00788eb1a17cfe1c4c6d2008612").then(function (response) {
                    $scope.initialize = addIngredientService.setPageVals(response.data);
                    return (addIngredientService.getPageVals());
                });
            }, function(error) {
                alert(JSON.stringify(error));
            });
        }, 700);
    }

   /* $scope.scan = function () {
        $scope.scanResults = $cordovaBarcodeScanner.scan().then(function (result) {
            console.log(result.text);

        }, function (error) {
            $scope.scanResults = 'Error: ' + error;
        });
    };*/

    $scope.retValue = "";
    $scope.model = "";

    $scope.getTestItems = function (query) {
        if (query) {
            return ($http.get("https://api.nutritionix.com/v1_1/search/" + query + "?results=0%3A20&cal_min=0&cal_max=50000&fields=*&appId=b62a1056&appKey=0096e00788eb1a17cfe1c4c6d2008612").then(function (response) {
                $scope.retArray = { items: [] };

                // include recipeIngredients or recipes, depending on where we came from
                var pageCalled = addIngredientService.getPageCalled();
                var toFilter = [];
                if (pageCalled == "addIngredient" && $scope.recipeIngredients) {
                    toFilter = toFilter.concat($scope.recipeIngredients);
                }
                if (pageCalled == "addNutrition" && $scope.recipes) {
                    toFilter = toFilter.concat($scope.recipes);
                }
                if (toFilter) {
                    // add matching items to returned array
                    var matchingRecipeIngredients = toFilter.filter(function (recipeIngredient) {
                        return recipeIngredient.ingName && recipeIngredient.ingName.toLowerCase().indexOf(query.toLowerCase()) != -1;
                    });
                    matchingRecipeIngredients = matchingRecipeIngredients.slice(0, matchingRecipeIngredients.length < 20 ? matchingRecipeIngredients.length : 20);
                    $scope.retArray.items = $scope.retArray.items.concat(matchingRecipeIngredients);
                }

                // add matches from API to returned array
                var dataObject = response.data.hits;
                var dataArray = new Array;
                var i = 0;
                for (var o in response.data.hits) {
                    dataArray.push(response.data.hits[o].fields);
                    i = i + 1;
                }

                $scope.retArray.items = $scope.retArray.items.concat(dataArray);
                $scope.model = $scope.retArray;
                return ($scope.retArray);
            }));
        };

        return $scope.retArray;
    };

    $scope.itemsClicked = function (callback) {
        $scope.initialize = addIngredientService.setPageVals(callback.selectedItems[0]);
    };

    $scope.$on('$ionicView.enter', function () {
        $scope.initialize = addIngredientService.getSpecificIngredient();
        $scope.measurement = $scope.initialize.measurement;


        // load all recipes and recipeIngredients the user has
        $scope.recipeIngredients = pullRecipeIngredientFirebaseService.pullRecipeIngredients().then(function (result) {
            $scope.recipeIngredients = result.map(function (recipeIngredient) {
                recipeIngredient.item_name = recipeIngredient.ingName;
                return recipeIngredient;
            });
        });

        $scope.recipes = pullRecipeFirebaseService.pullRecipe().then(function (result) {
            $scope.recipes = result.map(function (recipe) {
                var servings = (recipe.servesNMany && recipe.servesNMany >= 1) ? recipe.servesNMany : 1;
                var recipeItem = {
                    recipeGuid: recipe.recipeGuid,
                    ingName: recipe.recipeName,
                    item_name: recipe.recipeName,
                    fatContent: Math.round(recipe.totalFat / servings),
                    calories: Math.round(recipe.totalCal / servings),
                    protein: Math.round(recipe.totalProtein / servings),
                    sugars: Math.round(recipe.totalSugars / servings),
                    sodium: Math.round(recipe.totalSodium / servings)
                };
                return recipeItem;
            });
        });
    });

    $scope.doStuff = function () {
        // $ionicLoading.show`
        if (angular.isUndefined($scope.initialize.ingName) || $scope.initialize.ingName == "") {
            $ionicPopup.alert({
                title: 'Oh No! You missed something.',
                template: 'Please check and fill out the food name.'
            });
        }
        else {
            addIngredientService.setIngredient($scope.initialize, $http);
            addIngredientService.totalContentsAdd($scope.initialize, $http);
            $scope.initialize = addIngredientService.setEmpty();
            $state.go(addIngredientService.getPageCalled(), {}, { reload: true });
        }
    };
})

app.controller('addARecipeCtrl', function ($scope, pullRecipeIngredientFirebaseService, RecipeService, $cordovaCamera, nixApi, $q, $http, $state, $window, $ionicPopup, $ionicPopover, addIngredientService, addToFirebaseService) {
    $scope.addRecipeForm = {
        recipeName: "",
        recipeDesc: "",
        servesNMany: "",
        prepTime: "",
        cookingTime: "",
        totalVal: ""
    };
    $scope.totalVal = {
        calories: "",
        sugars: "",
        fatContent: "",
        protein: "",
        sodium: ""
    }

    //enables back button
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });

    //logic to fill ingredient page when we navigate to it. Ensures no ingredient dups
    $scope.$on('$ionicView.enter', function () {
        if (RecipeService.viewingRecipe != null && addIngredientService.getedit()== 0 ) {
            addIngredientService.setEmpty();
            addIngredientService.setTotalEmpty();
            addIngredientService.resetArray();
            $scope.addRecipeForm = RecipeService.viewingRecipe;
            addIngredientService.totalUpdate(RecipeService.viewingRecipe);
            pullRecipeIngredientFirebaseService.pullRecipeIngredients().then(function (result) {
                addIngredientService.setAllIngredient(result.filter(function (recipeIngredient) {
                    return recipeIngredient.recipeGuid === $scope.addRecipeForm.recipeGuid;
                }));
            });
            addIngredientService.setedit(1);
        }
    });

    //ng-repeat ing func
    $scope.ingredient = function () {
            $scope.retVals = addIngredientService.getAllIngredient();
            $scope.totalVal = addIngredientService.getTotalContents($http);
    };

    //ng-repeat remove ing
    $scope.setRemove = function (value) {
        $scope.retVals = addIngredientService.deleteSpecificIngredient(value);
        $scope.totalVal = addIngredientService.totalContentsSub(value);
  };

    //full ing page with selected item
    $scope.setFill = function (value) {
        addIngredientService.setSpecificIngredient(value);
        addIngredientService.setPageCalled('addARecipe');
        $state.go('addAnIngredientRecipe', {}, { reload: true });
    };

    //navigate to empty ing page
    $scope.setNew = function () {
        addIngredientService.setEmpty();
        addIngredientService.setPageCalled('addARecipe');
        $state.go('addAnIngredientRecipe', {}, { reload: true });
    };


    //log item and empty page
    $scope.trackMeal = function () {
        if ($scope.addRecipeForm.recipeName == "") {
                $ionicPopup.alert({
                    title: 'Oh No! You missed something.',
                    template: 'Please add a recipe title.'
                });
            }
        else {
            addToFirebaseService.saveRecipe($scope.addRecipeForm, addIngredientService.getAllIngredient(), addIngredientService.getTotalContents(), $scope.picture);

                $scope.retVals = addIngredientService.getAllIngredient();
                $scope.totalVal = addIngredientService.getTotalContents($http);
                $scope.addRecipeForm.recipeName = "";
                $scope.addRecipeForm.recipeDesc = "";
                $scope.addRecipeForm.servesNMany = "";
                $scope.addRecipeForm.prepTime = "";
                $scope.addRecipeForm.cookingTime = "";
                $scope.initialize = {};
                $scope.picture = "";
                $scope.height = "0px";
                $scope.width = "0px";
                addIngredientService.setEmpty();
                addIngredientService.setTotalEmpty();
                addIngredientService.resetArray();
                RecipeService.setViewingRecipe(null);

                $state.go('main.recipeBook', {}, { reload: true });
            }
    };

    $scope.addPicture = function () {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            //IN PROD -sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 480,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
        $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.picture = imageData;
            $scope.height = "200px";
            $scope.width = "200px";
            //   $state.go('main.addARecipe');
        }, function (err) {
            console.error("yolo ", err);
        });
    };


})

app.controller('viewRecipeCtrl', function ($scope, $http, $state, $window, $ionicPopover, RecipeService, pullRecipeIngredientFirebaseService) {
    //enables back button
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });

    $scope.recipe = null;
    $scope.recipeIngredients = [];
    $scope.height = "200px";
    $scope.width = "200px";

    $scope.$on('$ionicView.enter', function () {
        $scope.recipe = RecipeService.viewingRecipe;
        pullRecipeIngredientFirebaseService.pullRecipeIngredients().then(function (result) {
            $scope.recipeIngredients = result.filter(function (recipeIngredient) {
                return recipeIngredient.recipeGuid === $scope.recipe.recipeGuid;
            });
        });
    });


    $scope.editRecipe = function () {
            $state.go("addARecipe");
    }
})




//NUTRITION CONTROLS
app.controller('addNutritionCtrl', function ($scope, $http, RecipeService, pullNutritionIngredientFirebaseService, NutritionService, $state, $cordovaCamera, $ionicPopup, addIngredientService, addToFirebaseService, $filter) {
    $scope.formData = {
        mealName: "",
        mealContents: "",
        foodType: "",
        date: "",
        time: "",
        comments: ""
    };
    $scope.picture = "";
    $scope.height = "0px";
    $scope.width = "0px";
    $scope.pull = "";
    $scope.retVals = "";
    $scope.totalVal = addIngredientService.getTotalContents($http);

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });


    //logic to fill ingredient page when we navigate to it. Ensures no ingredient dups
    $scope.$on('$ionicView.enter', function () {
        if (NutritionService.viewingNutrition != null && addIngredientService.getedit() == 0) {
            console.log(NutritionService.viewingNutrition);
            $scope.formData = NutritionService.viewingNutrition;
            $scope.formData.date = new Date($scope.formData.date);
            $scope.formData.time = new Date($scope.formData.time);
            addIngredientService.totalUpdate(NutritionService.viewingNutrition);
            var x = pullNutritionIngredientFirebaseService.pullNutritionIngredients().then(function (result) {
                var temp = result.filter(function (nutritionIngredient) {
                 return nutritionIngredient.nutritionGuid === $scope.formData.nutritionGuid;
                });
                addIngredientService.setAllIngredient(temp);
                return (temp);
            });

            addIngredientService.setedit(1);
        }
    });

    $scope.mealInfo = function () {
        $scope.retVals = addIngredientService.getAllIngredient();
        $scope.totalVal = addIngredientService.getTotalContents($http);
    };

    $scope.setRemove = function (value) {
        $scope.retVals = addIngredientService.deleteSpecificIngredient(value);
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
                if ($scope.formData.mealName == "" || $scope.formData.date == "") {
                    $ionicPopup.alert({
                        title: 'Oh No! You missed something.',
                        template: 'Please check and fill in the meal name and date.'
                    });
                }
                else {
                    addToFirebaseService.saveNutrition($scope.formData, addIngredientService.getAllIngredient(), $scope.picture, $scope.totalVal);
                    addIngredientService.setTotalEmpty();
                    $scope.formData.mealName = "";
                    $scope.formData.mealContents = "";
                    $scope.formData.foodType = "";
                    $scope.formData.date = "";
                    $scope.formData.time = "";
                    $scope.formData.comments = "";
                    $scope.picture = "";
                    $scope.height = "0px";
                    $scope.width = "0px";
                    addIngredientService.setEmpty();
                    addIngredientService.setTotalEmpty();
                    $scope.retVals = addIngredientService.resetArray();
                    NutritionService.setViewingNutrition(null);
                    $state.go("main.dailyNutrition", {}, { reload: true });
                }
            }
    };

        $scope.addIngredient = function (form) {
            addIngredientService.setEmpty();
            addIngredientService.setPageCalled("addNutrition");
            $state.go('addAnIngredientRecipe', {}, { reload: true });
        };


        $scope.addPicture = function () {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                //IN PROD - sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 480,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
            $cordovaCamera.getPicture(options).then(function (imageData) {
                $scope.picture = imageData;
                $scope.height = "200px";
                $scope.width = "200px";
                //   $state.go('main.addARecipe');
            }, function (err) {
                console.error("yolo ", err);
            });
        };
    })

app.controller('viewNutritionCtrl', function ($scope, $state, NutritionService, pullNutritionIngredientFirebaseService) {
    $scope.nutrition = null;
    $scope.nutritionIngredients = [];
    $scope.totalVal = {};
    $scope.height = "200px";
    $scope.width = "200px";

    //enables back button
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });

    $scope.$on('$ionicView.enter', function () {
        $scope.nutrition = NutritionService.viewingNutrition;
        pullNutritionIngredientFirebaseService.pullNutritionIngredients().then(function (result) {
            $scope.nutritionIngredients = result.filter(function (nutritionIngredient) {
                return nutritionIngredient.nutritionGuid === $scope.nutrition.nutritionGuid;
            });
        });
    });

    $scope.editNutrition = function () {
        $state.go("addNutrition");
    }
})

app.controller('dailyNutritionCtrl', function ($scope, $state, NutritionService, addIngredientService) {
        $scope.setRemove = function (obj) {
           // addIngredientService.deleteMeal(guid);
            NutritionService.deleteNutrition(obj);
        }

        $scope.addNewNutrition = function(){
            NutritionService.setViewingNutrition(null);
            addIngredientService.setedit(0);
            $state.go("addNutrition");
        }

        $scope.viewNutrition = function (obj) {
            NutritionService.setViewingNutrition(obj);
            addIngredientService.setedit(1);
            $state.go('viewNutrition', {}, { reload: true });
        }

        $scope.editNutrition = function (obj) {
            addIngredientService.setedit(1);
            NutritionService.setViewingNutrition(obj);
            $state.go("addNutrition");
        }
    })

app.controller('nutritionCtrl', function ($scope, $state, NutritionService, pullNutritionFirebaseService, addIngredientService) {
        $scope.retVals2 = pullNutritionFirebaseService.pullNutrition().then(function (result) {
            $scope.retVals = result;
        });

        $scope.viewNutrition = function (nutrition) {
            NutritionService.setViewingNutrition(nutrition);
            addIngredientService.setedit(0);
            $state.go('viewNutrition', {}, { reload: true });
        }
    })
