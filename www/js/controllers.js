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


app.controller('addIngredientRecipeCtrl', function ($scope,  $ionicPopup, $cordovaBarcodeScanner, $rootScope, $state, $http, nixApi, addIngredientService, pullRecipeIngredientFirebaseService, pullRecipeFirebaseService) {
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });

    $scope.vm = "";
    $scope.scanResults = '';

    $scope.scan = function () {
        $scope.scanResults = $cordovaBarcodeScanner.scan().then(function (result) {
            $http.get("https://api.nutritionix.com/v1_1/item?upc=" + result.text + "&appId=b62a1056&appKey=0096e00788eb1a17cfe1c4c6d2008612").then(function (response) {
                $scope.initialize = addIngredientService.setPageVals(response.data);
            });
        }, function (error) {
            $scope.scanResults = 'Error: ' + error;
        });
    };

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
            });
        }
        console.log($scope.retArray);
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
        // $ionicLoading.show();
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



app.controller('addARecipeCtrl', function ($scope, $cordovaCamera, nixApi, $q, $http, $state, $window, $ionicPopup, $ionicPopover, addIngredientService, addToFirebaseService) {
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });

    $scope.retVals = "";
    $scope.totalVal = addIngredientService.getTotalContents($http);
    $scope.picture = "";
    $scope.height = "0px";
    $scope.width = "0px";

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
        addIngredientService.setPageCalled('addARecipe');
        $state.go('addAnIngredientRecipe', {}, { reload: true });
    };

    $scope.setNew = function () {
        addIngredientService.setEmpty();
        addIngredientService.setPageCalled('addARecipe');
        $state.go('addAnIngredientRecipe', {}, { reload: true });
    };

    $scope.trackMeal = function (form) {
        if (form.$valid) {
            if (angular.isUndefined(form.recipeName)) {
                $ionicPopup.alert({
                    title: 'Oh No! You missed something.',
                    template: 'Please add a recipe title.'
                });
            }
            else {
                $scope.retVals = addIngredientService.getAllIngredient();
                addToFirebaseService.saveRecipe(form, $scope.retVals, $scope.totalVal, $scope.picture);

                form.recipeName = "";
                form.recipeDesc = "";
                form.servesNMany = "";
                form.prepTime = "";
                form.cookingTime = "";
                $scope.initialize = {};
                $scope.picture = "";
                $scope.height = "0px";
                $scope.width = "0px";
                addIngredientService.setEmpty();
                addIngredientService.resetArray();
                addIngredientService.setTotalEmpty();
                $state.go('main.recipeBook', {}, { reload: true });
            }
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
})


app.controller('addMedicineCtrl', function ($scope, $ionicPopup,  medicineService, $state) {
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
        if ($scope.addMed.medicineName== "") {
            $ionicPopup.alert({
                title: 'Oh No! You missed something.',
                template: 'Please add a medicine name.'
            });
        }
        else {
            $scope.medicineName= "";
            $scope.amount= "";
            $scope.taken= "";
            $scope.extra=  "";
            medicineService.add($scope.addMed);
            $state.go("main.myMeds");
        }
    }
})

.controller('addNutritionCtrl', function ($scope, $http, $state, $cordovaCamera, $ionicPopup, addIngredientService, addToFirebaseService) {
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });

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
            if (form.$valid) {
                if ($scope.formData.mealName == "" || $scope.formData.date== ""){
                    $ionicPopup.alert({
                        title: 'Oh No! You missed something.',
                        template: 'Please check and fill in the meal name and date.'
                    });
                }
                else {
                    addToFirebaseService.saveNutrition($scope.formData, addIngredientService.getAllIngredient(), $scope.picture);
                    addIngredientService.setTotalEmpty();
                    $scope.picture = "";
                    $scope.height = "0px";
                    $scope.width = "0px";
                    $state.go("main.dailyNutrition", {}, { reload: true });
                }
            }
            else {
                console.log("Form is not valid")
            }
        }
    };

        $scope.addIngredient = function (form) {
            addIngredientService.setEmpty();
            addIngredientService.setPageCalled("addNutrition");
            $state.go('addAnIngredientRecipe', {}, { reload: true });
        };


        function clear(form) {
            form.mealName = "";
            form.mealContents = "";
            form.foodType = "";
            form.date = "";
            form.time = "";
            form.comments = "";
        }

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

    app.controller('shareMyDataCtrl', function ($scope, $cordovaSocialSharing, NutritionService) {
        $scope.formData = {
            NutritionInfo: false,
            MedInfo: false,
            RecipeInfo: false,
            StartDate: null,
            EndDate: null,
            recipient: ""

        };

        $scope.shareData = function () {
            var data = {}; //do I want to put the retrieved information in the email body or as an attachment?
            var subject = "Test";
            var recipient = [$scope.formData.recipient];
            var ccArr = null;
            var bccArr = null;
            var file = null;

            //TODO: get data form a service
            if ($scope.formData.NutritionInfo) {
                data.nutrion = NutritionService.getNutrition();
            }

            console.log(data);

            $cordovaSocialSharing.shareViaEmail(data, subject, recipient, ccArr, bccArr, file)
              //.canShareViaEmail()
              .then(function (result) {
                  console.log("Success!");
              }, function (err) {
                  // An error occurred. Show a message to the user
                  console.log(err);

              });

            //cordova.plugins.email.open({
            //  to:          recipient, // email addresses for TO field
            //  cc:          ccArr, // email addresses for CC field
            //  bcc:         bccArr, // email addresses for BCC field
            //  attachments: file, // file paths or base64 data streams
            //  subject:    subject, // subject of the email
            //  body:       data // email body (for HTML, set isHtml to true)
            //  //isHtml:    false, // indicats if the body is HTML or plain text
            //});
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

    app.controller('recipeBookCtrl', function ($scope, $state, pullRecipeFirebaseService, RecipeService) {
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

        $scope.viewRecipe = function (recipe) {
            RecipeService.setViewingRecipe(recipe);
            $state.go('viewRecipe', {}, { reload: true });
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
            $scope.retVals = result;
        });
    })
