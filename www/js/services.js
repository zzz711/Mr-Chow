var app = angular.module('app.services', ['ngCordova', 'firebase', 'ngRoute', 'jsonFormatter']);

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}


function isBlank(x) {
    if (x == "") {
        return 0;
    }
    return x;
}

function isUndefined(val) {
    if (angular.isUndefined(val)) {
        return null
    }
    else
        return val
}


function getUID() {
    var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");

    //I occasionally get an error about not being able to ready property uid of null. I'm hoping this try catch will fix that
    try{
      var user = fbUser.getAuth();
      //var userGUID = user.uid;
      return user.uid;
    }
    catch (err){
      if(e instanceof NullReferenceException){
        $ionicPopup.show({
          title: "Your login cookie has expired. You will now be logged out"
        });
        user.unauth();
        $state.go("login");
      }
    }

  //return userGUID;
}


app.service('AuthService', function ($q, $ionicPopup, $state) {
    function logOutUser() {
    var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");

    fbUser.unauth();
  }

    var self = {
        user: null,
        login: function (email, password) {
            var d = $q.defer();
            var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");

          fbUser.authWithPassword({
            "email": email,
            "password": password
            }).then(function (authData) {
                    console.log("login successful");
                    $state.go("main.recipeBook");
            }).catch(function (error) {
                    $ionicPopup.alert({
                        title: "Login Error"
                        //subtitle: error.message
                    });
                    console.log(error);
                    d.reject(error);
            });


            return d.promise;
        },

        signup: function (name, email, password) {
            var d = $q.defer();
            var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");

            if (fbUser.getAuth()) {
              fbUser.unauth();
            }

            fbUser.createUser({
              email: email,
              password: password
            }).then(function (userData) {
              console.log("User created successfully!");
                    $state.go("login");
              return d.promise;
            }).catch(function (error) {
                    console.log(error);
            });

        },

        getUser: function () {
          var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");

          return fbUser.getAuth();
        },


        changePW: function (data) {
          var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");
          var user = fbUser.getAuth();

          fbUser.changePassword({
            email: user.password.email, //not sure this will work
            oldPassword: data.password,
            newPassword: data.newPassword
          }).then(function () {
            $ionicPopup.alert({
              title: "Password Changed"
            });
            logOut();
            form.$setPristine();
          }).catch(function (error) {
              console.log(error);
          })
        },

        changeEmail: function (newEmail, passwrd) {
          var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");
          var user = fbUser.getAuth();

          fbUser.changeEmail({
            oldEmail: fbUser.getAuth().password.email,
            newEmail: newEmail,
            password: passwrd
            }, function (error) {
            if (error) {
              switch (error.code) {
                //TODO change these to popups
                case "INVALID_USER":
                  console.log("The specified user account does not exist.");

                  break;
                case "INVALID_PASSWORD":
                  console.log("The specified user account password is incorrect.");
                  break;
                default:
                  console.log("Error updating user:", error);
              }
            }
                else {
                $ionicPopup.alert({
                  title: "Email Updated"
                });
              $state.go("login");

            }

          });
        logOutUser();
        },

        getEmail: function () {
        var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");
        return fbUser.password.email;
      },

        logOut: function () {
        var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");

        fbUser.unauth();
      }

    };

    return self;
});


app.service("addToFirebaseService", function ($firebaseArray, $firebaseObject, NutritionService, RecipeService) {

    return {
        saveNutrition: function (data, ingredients, pic, totals) {
            // delete the nutrition if it already exists

            if (NutritionService.viewingNutrition != null) {
                NutritionService.deleteNutrition(NutritionService.viewingNutrition);
            }

            var nutritionGuid = guid();
            nutritionTable = new Firebase("https://boiling-fire-9023.firebaseio.com/" + getUID() + "/nutrition/");
            nutritionTable = $firebaseArray(nutritionTable);

            nutritionTable.$add({
                nutritionGuid: nutritionGuid,
                mealName: isUndefined(data.mealName),
                meal: isUndefined(data.meal),
                date: data.date ? data.date.toUTCString() : isUndefined(data.date),
                time: data.time ? data.time.toUTCString() : isUndefined(data.time),
                comments: isUndefined(data.comments),
                picture: isUndefined(pic),
                totalCal: isUndefined(totals.calories),
                totalProtein: isUndefined(totals.protein),
                totalSugars: isUndefined(totals.sugars),
                totalSodium: isUndefined(totals.sodium),
                totalFat: isUndefined(totals.fatContent),
            });

            var x = 1;
            angular.forEach(ingredients, function (ing, index) {
                var ingredientGuid = guid();
                var ingredientTable = new Firebase("https://boiling-fire-9023.firebaseio.com/" + getUID() + "/nutritionIngredient/");
                ingredientTable = $firebaseArray(ingredientTable);
                x = x + 1;
                ingredientTable.$add({
                    nutritionGuid: nutritionGuid,
                    ingredientGuid: ingredientGuid,
                    ingName: isUndefined(ing.ingName),
                    fatContent: isUndefined(ing.fatContent),
                    calories: isUndefined(ing.calories),
                    protein: isUndefined(ing.protein),
                    sugars: isUndefined(ing.sugars),
                    sodium: isUndefined(ing.sodium),
                    freshness: isUndefined(ing.freshness),
                    quantity: isUndefined(ing.quantity),
                    comments: isUndefined(ing.comments)
                });
            });
        },
        saveRecipe: function (data, ingredients, totals, pic) {
            // delete the recipe if it already exists
            if (RecipeService.viewingRecipe != null) {
                RecipeService.deleteRecipe(RecipeService.viewingRecipe);
            }

            var recipeGuid = guid();
            recipeTable = new Firebase("https://boiling-fire-9023.firebaseio.com/" + getUID() + "/recipe/");
            recipeTable = $firebaseArray(recipeTable);

            recipeTable.$add({
                 recipeGuid: recipeGuid,
                 recipeName: isUndefined(data.recipeName),
                 prepTime: isUndefined(data.prepTime),
                 cookingTime: isUndefined(data.cookingTime),
                 servesNMany: isUndefined(data.servesNMany),
                 recipeDesc: isUndefined(data.recipeDesc),
                 totalCal: isUndefined(totals.calories),
                 totalProtein: isUndefined(totals.protein),
                 totalSugars: isUndefined(totals.sugars),
                 totalSodium: isUndefined(totals.sodium),
                 totalFat: isUndefined(totals.fatContent),
                 picture: isUndefined(pic)

             });
            var x = 1;

            angular.forEach(ingredients, function (ing, index) {
                console.log(ing);
                var ingredientTable = new Firebase("https://boiling-fire-9023.firebaseio.com/" + getUID() + "/recipeIngredient/");
                ingredientTable = $firebaseArray(ingredientTable);

                var ingredientGuid = guid();
                x = x + 1;
                ingredientTable.$add({
                            recipeGuid: recipeGuid,
                            ingredientGuid: ingredientGuid,
                             ingName: isUndefined(ing.ingName),
                            fatContent: isUndefined(ing.fatContent),
                            calories: isUndefined(ing.calories),
                            protein: isUndefined(ing.protein),
                            sugars: isUndefined(ing.sugars),
                            sodium: isUndefined(ing.sodium),
                            freshness: isUndefined(ing.freshness),
                            quantity: isUndefined(ing.quantity),
                            comments: isUndefined(ing.comments)
                        });
            });
      }
    };
 })

app.service("RecipeService", function ($q, $ionicPopup, $firebaseObject, pullRecipeIngredientFirebaseService) {
    var self = {
        'page': 0,
        'page_size': '20',
        'isLoading': false,
        'isSaving': false,
        'hasMore': true,
        'results': [],
        'refresh': function () {
            self.page = 0;
            self.isLoading = false;
            self.isSaving = false;
            self.hasMore = true;
            self.results = [];
            return self.load();
        },
        'next': function () {
            self.page += 1;
            return self.load();
        },
        'load': function () {
            self.isLoading = true;
            var d = $q.defer();

            //stuff here

            return d.promise;
        },
        viewingRecipe: null,
        setViewingRecipe: function (recipe) {
            self.viewingRecipe = recipe;
        },
        deleteRecipe: function (recipe) {
            var url = "https://boiling-fire-9023.firebaseio.com/";
            var partURL = url.concat(getUID());
            var fullURL = partURL.concat("/recipe/" + recipe.$id);
            var fbMeal = new Firebase(fullURL);
            var mealObj = $firebaseObject(fbMeal);
            var recipeGUID = recipe.recipeGuid;

            // delete associated recipeIngredients
            pullRecipeIngredientFirebaseService.pullRecipeIngredients().then(function (result) {
                var toDelete = result.filter(function (recipeIngredient) {
                    return recipeIngredient.recipeGuid === recipe.recipeGuid;
                });
                for (var i = 0; i < toDelete.length; ++i) {
                    var fbRecipeIngredient = $firebaseObject(new Firebase("https://boiling-fire-9023.firebaseio.com/" + getUID() + "/recipeIngredient/" + toDelete[i].$id));
                    fbRecipeIngredient.$remove();
                }
            });

            // delete recipe
            mealObj.$remove().then(function(ref){
              console.log("item deleted");
            }, function (error) {
              console.log(error);
            });
      },

        getRecipe: function (callBack) {
        var url = "https://boiling-fire-9023.firebaseio.com/" + getUID() + "/recipe/";
        var fbObj = new Firebase(url);
        var allRecipes = [];
        var num = 0;

        fbObj.orderByChild("recipeName").on("value", function (snapshot) {
          for (var p in snapshot.val()) {
            var currentRecipe = snapshot.val()[p];
            currentRecipe.key = p;

            allRecipes[num] = currentRecipe;
            num++;
          }
          callBack(allRecipes);
        });

      }

    };


    return self;
});

app.service('addIngredientService', function ($q, $firebaseObject) {
        var x = [];
        var i = 1;
        var editRecipe = 0;
        var barcode = null;
        var pageCalled = "";
        var localSetIngredients = function (data) {
            x.push({
                id: i,
                ingName: isUndefined(data.ingName),
                fatContent: isBlank(isUndefined(data.fatContent)),
                foodColor: isUndefined(data.foodColor),
                calories: isBlank(isUndefined(data.calories)),
                protein: isBlank(isUndefined(data.protein)),
                sugars: isBlank(isUndefined(data.sugars)),
                sodium: isBlank(isUndefined(data.sodium)),
                freshness: isUndefined(data.freshness),
                quantity: isUndefined(data.quantity),
                comments: isUndefined(data.comments)
            });
            i = i + 1;
        }
        //page information that is passed between ingredient screen and another screen
        var passedPage = {
            id: "",
            foodColor: "",
            fatContent: "",
            calories: "",
            protein: "",
            sugars: "",
            sodium: "",
            freshness: "",
            quantity: "",
            comments: ""
        };

        //sum of all ingredients added to recipe or meal
        var totalContents = {
            fatContent: 0,
            calories: 0,
            protein: 0,
            sugars: 0,
            sodium: 0
        };

      return {
          totalContentsAdd: function (data, $http) {
              totalContents.fatContent = totalContents.fatContent + Math.round(isBlank(isUndefined(data.fatContent)));
              totalContents.calories = totalContents.calories + Math.round(isBlank(isUndefined(data.calories)));
              totalContents.protein = totalContents.protein + Math.round(isBlank(isUndefined(data.protein)));
              totalContents.sugars = totalContents.sugars + Math.round(isBlank(isUndefined(data.sugars)));
              totalContents.sodium = totalContents.sodium + Math.round(isBlank(isUndefined(data.sodium)));
          },

          totalContentsSub: function (data, $http) {
              totalContents.fatContent = totalContents.fatContent - Math.round(isBlank(isUndefined(data.fatContent)));
              totalContents.calories = totalContents.calories - Math.round(isBlank(isUndefined(data.calories)));
              totalContents.protein = totalContents.protein - Math.round(isBlank(isUndefined(data.protein)));
              totalContents.sugars = totalContents.sugars - Math.round(isBlank(isUndefined(data.sugars)));
              totalContents.sodium = totalContents.sodium - Math.round(isBlank(isUndefined(data.sodium)));
              return totalContents;
          },
          totalUpdate: function (data, $http) {
              totalContents.fatContent = isBlank(isUndefined(data.totalFat));
              totalContents.calories = isBlank(isUndefined(data.totalCal));
              totalContents.protein = isBlank(isUndefined(data.totalProtein));
              totalContents.sugars = isBlank(isUndefined(data.totalSugars));
              totalContents.sodium = isBlank(isUndefined(data.totalSodium));
          },

          getTotalContents: function ($http) {
              return totalContents;
          },

          //tells ingredient page where to redirect to
          getPageCalled: function ($http) {
              return pageCalled;
          },

          //sets ingredient page for redirection to
          setPageCalled: function (pageCallingData, $http) {
              pageCalled = pageCallingData;
          },

          getedit: function ($http) {
              return editRecipe;
          },
          setedit: function (data, $http) {
              editRecipe = data;
          },

          getBarcode: function ($http) {
              return barcode;
          },
          setBarcode: function (data, $http) {
              barcode = data;
          },


          //gets current page status
          getSpecificIngredient: function () {
              return (passedPage);
          },

          //get items from ingredient page and save
          setIngredient: function (data, $http) {
            localSetIngredients(data);
            },

            //returns every saved ingredient for list
          getAllIngredient: function () {
              return x;
            },

            getPageVals: function () {
                return passedPage;
            },

            setAllIngredient: function (val) {
            angular.forEach(val, function (obj) {
                localSetIngredients(obj);
            })
            },

            setPageVals: function (item) {
                if (item.ingredientGuid || item.recipeGuid) {
                    this.setSpecificIngredient(item);
                }
                else {
                    passedPage.id = isBlank(isUndefined(item.brand_id));
                    passedPage.ingName = isBlank(isUndefined(item.item_name));
                    passedPage.foodColor = isBlank(isUndefined(item.foodColor));
                    passedPage.freshness = isBlank(isUndefined(item.freshness));
                    passedPage.fatContent = isBlank(isUndefined(item.nf_total_fat));
                    passedPage.calories = isBlank(isUndefined(item.nf_calories));
                    passedPage.protein = isBlank(isUndefined(item.nf_protein));
                    passedPage.sugars = isBlank(isUndefined(item.nf_sugars));
                    passedPage.sodium = isBlank(isUndefined(item.nf_sodium));
                    passedPage.quantity = (isBlank(isUndefined(item.nf_serving_size_qty)) + " " + isBlank(isUndefined(item.nf_serving_size_unit)));
                    passedPage.comments = "";
                }
                return passedPage;
            },

            deleteSpecificIngredient: function (val) {
                var index = x.indexOf(val);
                x.splice(index, 1);
                return x;
            },

            setSpecificIngredient: function (val) {
                passedPage.id = val.id;
                passedPage.ingName = val.ingName;
                passedPage.foodColor = val.foodColor;
                passedPage.freshness = val.freshness;
                passedPage.fatContent = val.fatContent;
                passedPage.calories = val.calories;
                passedPage.protein = val.protein;
                passedPage.sugars = val.sugars;
                passedPage.sodium = val.sodium;
                passedPage.quantity = val.quantity;
                passedPage.comments = val.comments;
                var index = x.indexOf(val);
                x.splice(index, 1);
            },

            //empties service
            setEmpty: function () {
                passedPage.id = "";
                passedPage.ingName = "";
                passedPage.foodColor = "";
                passedPage.freshness = "";
                passedPage.calories = "";
                passedPage.protein = "";
                passedPage.sugars = "";
                passedPage.sodium = "";
                passedPage.fatContent = "";
                passedPage.quantity = "";
                passedPage.comments = "";
                return passedPage;
            },
            setTotalEmpty: function () {
                totalContents.fatContent = 0;
                totalContents.calories = 0;
                totalContents.protein = 0;
                totalContents.sugars = 0;
                totalContents.sodium = 0;
            },
           //empties service array
            resetArray: function () {
                    x.splice(0, x.length);
                    return x;
            }
        };
    });

app.service("medicineService", function ($q, $firebaseObject) {
    function logDate() {
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        var fullDate = month + "/" + day + "/" + year;
        return fullDate;

    }

  function load() {
        var fbMed = new Firebase("https://boiling-fire-9023.firebaseio.com" + getUID() + "/medicine/");
        var medObj = $firebaseObject(fbMed);

        medObj.$loaded()
          .then(function (data) {
              console.log(data == medObj);
              //return medObj;
          }).catch(function (error) {
              console.log(error);
          });

    }

  return {
      viewingMed: null,
      setViewingMed: function (nutrition) {
          this.viewingNutrition = nutrition;
      }    ,
      add: function (data) {


            var medGUID = guid();
            var url = "https://boiling-fire-9023.firebaseio.com/" + getUID() + "/medicine/";
            var fullUrl = url.concat(medGUID.toString());
            var fbMed = new Firebase(fullUrl);
            var medObj = $firebaseObject(fbMed);
            var user = fbMed.getAuth();
            var userEmail = user.password.email;

            medObj.guid = medGUID;
            medObj.user = userEmail;
            medObj.name = data.medicineName;
            medObj.amount = data.amount;
            medObj.taken = data.taken;
            medObj.extra = data.extra;
            medObj.date = logDate();

            medObj.$save().then(function (fbMed) {
                fbMed.key() === medObj.$id;
            }), function (error) {
                console.log(error);
            }
        },

        deleteMeds: function (medObj) {
            var url = "https://boiling-fire-9023.firebaseio.com/";
            var partURL = url.concat(getUID());
            var fullURL = partURL.concat("/medicine/" + medObj.$id);
            var fbMeal = new Firebase(fullURL);
            var mealObj = $firebaseObject(fbMeal);

            mealObj.$remove().then(function (ref) {
                console.log("item deleted");
            }, function (error) {
                console.log(error);
            })

        },

        getMeds: function (callBack) {
        var url = "https://boiling-fire-9023.firebaseio.com/" + getUID() + "/medicine/";
        var fbObj = new Firebase(url);
        var allMeds = [];
        var num = 0;

            fbObj.orderByChild("date").once("value", function (snapshot) {
          for (var p in snapshot.val()) {
            if (snapshot.val().hasOwnProperty(p)) {
              var currentMed = snapshot.val()[p];
              currentMed.key = p;
              allMeds[num] = currentMed;
              num++;
            }
          }
          //var currentMed = {};
          //currentMed.key = snapshot.key();
          //var key = currentMed.key; //do I need this?
          //
          //currentMed.name = snapshot.val().name;
          //currentMed.taken = snapshot.val().taken;
          //currentMed.amount = snapshot.val().amount;
          //currentMed.extra = snapshot.val().extra;
          //currentMed.date = snapshot.val().date;
          //
          //allMeds[num] = currentMed;
          //num++;
          console.log(allMeds);
          callBack(allMeds);
        });


        }
    };
})

app.service("NutritionService", function ($firebaseArray, $firebaseObject, pullNutritionIngredientFirebaseService) {
    return {

    viewingNutrition: null,
    setViewingNutrition: function (nutrition) {
        this.viewingNutrition = nutrition;
    },

      getNutrition: function (startDate, endDate, callBack) {
      var url = "https://boiling-fire-9023.firebaseio.com/" + getUID() + "/nutrition/";
      var fbObj = new Firebase(url);
      var allMeals = [];
      var num = 0;
      var key;
      var test;

            fbObj.orderByChild("date").once("value", function (snapshot) {

        for (var p in snapshot.val()) {
          if (snapshot.val().hasOwnProperty(p)) {
                        if (new Date(snapshot.val()[p].date) >= startDate && new Date(snapshot.val()[p].date) <= endDate) {
              var currMeal = snapshot.val()[p];
              currMeal.key = p;
        allMeals[num] = currMeal;
        num++;
            }
          }
        }

        console.log(allMeals);
        callBack(allMeals);
      });
      },
      deleteNutrition: function (nutrition) {
          var url = "https://boiling-fire-9023.firebaseio.com/";
          var partURL = url.concat(getUID());
          var fullURL = partURL.concat("/nutrition/" + nutrition.$id);
          var fbMeal = new Firebase(fullURL);
          var mealObj = $firebaseObject(fbMeal);
          var nutritionGUID = nutrition.nutritionGuid;

          // delete associated recipeIngredients
          pullNutritionIngredientFirebaseService.pullNutritionIngredients().then(function (result) {
              var toDelete = result.filter(function (nutritionIngredient) {
                  return nutritionIngredient.nutritionGuid === nutrition.nutritionGuid;
              });
              for (var i = 0; i < toDelete.length; ++i) {
                  var fbNutritionIngredient = $firebaseObject(new Firebase("https://boiling-fire-9023.firebaseio.com/" + getUID() + "/nutritionIngredient/" + toDelete[i].$id));
                  fbNutritionIngredient.$remove();
              }
          });

          // delete recipe
          mealObj.$remove().then(function (ref) {
              console.log("item deleted");
          }, function (error) {
              console.log(error);
          });
      },

  }
})



app.service("pullRecipeFirebaseService", function ($firebaseArray) {
    return {
        pullRecipe: function () {
            return $firebaseArray(new Firebase("https://boiling-fire-9023.firebaseio.com/" + getUID() + "/recipe/")).$loaded();
        }
    };
})

app.service("pullRecipeIngredientFirebaseService", function ($firebaseArray) {
    return {
        pullRecipeIngredients: function () {
            return $firebaseArray(new Firebase("https://boiling-fire-9023.firebaseio.com/" + getUID() + "/recipeIngredient/")).$loaded();
        }
    };
})

app.service("pullMedsFirebaseService", function ($firebaseArray) {
    return {
        pullMeds: function () {
            return $firebaseArray(new Firebase("https://boiling-fire-9023.firebaseio.com/" + getUID() + "/medicine/")).$loaded();
        }
    };
})

app.service("pullNutritionFirebaseService", function ($firebaseArray) {
    return {
        pullNutrition: function () {
            return $firebaseArray(new Firebase("https://boiling-fire-9023.firebaseio.com/" + getUID() + "/nutrition/")).$loaded();
        }
    };
})

app.service("pullNutritionIngredientFirebaseService", function ($firebaseArray) {
    return {
        pullNutritionIngredients: function () {
            return $firebaseArray(new Firebase("https://boiling-fire-9023.firebaseio.com/" + getUID() + "/nutritionIngredient/")).$loaded();
        }
    };
})
