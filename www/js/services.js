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
    var user = fbUser.getAuth();

    var userGUID = user.uid;
    if(userGUID == null){
      $ionicPopup.show({
        title: "Your login cookie has expired. You will now be logged out"
      });
      user.unauth();
      $state.go("login");
    }

    //console.log(userGUID);
    else{return userGUID}
  //return userGUID;
}


app.service('AuthService', function ($q, $ionicPopup, $state) {
  function logOutUser(){
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
          }).then (function(authData) {
                    console.log("login successful");
                    $state.go("main.recipeBook");
          }).catch(function(error){
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
            }).then( function(userData) {
              console.log("User created successfully!");
                    $state.go("login");
              return d.promise;
            }).catch(function(error){
                    console.log(error);
            });

        },

        getUser: function(){
          var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");

          return fbUser.getAuth();
        },


        changePW: function(data){
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

        changeEmail: function(newEmail, passwrd){
          var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");
          var user = fbUser.getAuth();

          fbUser.changeEmail({
            oldEmail: fbUser.getAuth().password.email,
            newEmail: newEmail,
            password: passwrd
          }, function(error) {
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
              else{
                $ionicPopup.alert({
                  title: "Email Updated"
                });
              $state.go("login");

            }

          });
        logOutUser();
        },

      getEmail: function (){
        var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");
        return fbUser.password.email;
      },

      logOut: function (){
        var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");

        fbUser.unauth();
      }

    };

    return self;
});


app.service("addToFirebaseService", function ($firebaseArray, $firebaseObject) {

    return {
        saveNutrition: function (data, ingredients, pic) {
            var nutritionGuid = guid();
            nutritionTable = new Firebase("https://boiling-fire-9023.firebaseio.com/" + getUID() + "/nutrition/");
            nutritionTable = $firebaseArray(nutritionTable);

            nutritionTable.$add({
                nutritionGuid: nutritionGuid,
                mealName: isUndefined(data.mealName),
                meal: isUndefined(data.meal),
                date: isUndefined(data.date).toString(),
                time: isUndefined(data.time).toString(),
                comments: isUndefined(data.comments),
                picture: isUndefined(pic)
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
            var recipeGuid = guid();
            recipeTable = new Firebase("https://boiling-fire-9023.firebaseio.com/" + getUID() + "/recipe/");
            recipeTable = $firebaseArray(recipeTable);

            recipeTable.$add({
                 recipeGuid: recipeGuid,
                 recipeName:  isUndefined(data.recipeName),
                 prepTime:  isUndefined(data.prepTime),
                 cookingTime:  isUndefined(data.cookingTime),
                 servesNMany:  isUndefined(data.servesNMany),
                 totalCal: isUndefined(totals.calories),
                 totalProtein: isUndefined(totals.protein),
                 totalSugars: isUndefined(totals.sugars),
                 totalSodium: isUndefined(totals.sodium),
                 totalFat: isUndefined(totals.fatContent),
                 picture : isUndefined(pic)

             });
            var x = 1;

            angular.forEach(ingredients, function (ing, index) {
                var ingredientTable = new Firebase("https://boiling-fire-9023.firebaseio.com/"+ getUID() +"/recipeIngredient/");
                ingredientTable = $firebaseArray(ingredientTable);

                var ingredientGuid = guid();
                x = x + 1;
                ingredientTable.$add({
                            recipeGuid: recipeGuid,
                            ingredientGuid: ingredientGuid,
                            ingName:  isUndefined(ing.ingName),
                            fatContent: isUndefined(ing.fatContent),
                            calories : isUndefined(ing.calories),
                            protein : isUndefined(ing.protein),
                            sugars : isUndefined(ing.sugars),
                            sodium : isUndefined(ing.sodium),
                            freshness:  isUndefined(ing.freshness),
                            quantity:  isUndefined(ing.quantity),
                            comments:  isUndefined(ing.comments)
                        });
            });
      }
    };
 })

app.service("RecipeService", function ($q,$ionicPopup, $firebaseObject) {
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
        deleteRecipe: function (guid) {
            var url = "https://boiling-fire-9023.firebaseio.com/";
            var partURL = url.concat(getUID());
            var fullURL = partURL.concat("/recipe/" + guid.$id);
            var fbMeal = new Firebase(fullURL);
            var mealObj = $firebaseObject(fbMeal);

            mealObj.$remove().then(function(ref){
              console.log("item deleted");
            }, function(error){
              console.log(error);
            })

      },

      getRecipe: function(){
        var url = "https://boiling-fire-9023.firebaseio.com/" + getUID() + "/recipe/";
        var fbObj = new Firebase(url);
        var allRecipes = [];
        var num = 0;

        fbObj.orderByChild("recipeName").on("child_added", function(snapshot){
          var currentRecipe = {};
          currentRecipe.key = snapshot.key();
          var key = currentRecipe.key; //do I need this?

          currentRecipe.recipeName = snapshot.val().recipeName;
          currentRecipe.picture = snapshot.val().picture;
          currentRecipe.cookingTime = snapshot.val().cookingTime;
          currentRecipe.prepTime = snapshot.val().prepTime;
          currentRecipe.servesNMany = snapshot.val().servesNMany;
          currentRecipe.totalCal = snapshot.val().totalCal;
          currentRecipe.totalFat = snapshot.val().totalFat;
          currentRecipe.totalProtein = snapshot.val().totalProtein;
          currentRecipe.totalSodium = snapshot.val().totalSodium;
          currentRecipe.totalSugars = snapshot.val().totalSugars;


          allRecipes[num] = currentRecipe;
          num++;

        });
        return allRecipes
      }

    };


    return self;
});


app.service('addIngredientService', function ($q, $firebaseObject) {
        var x = [];
        var i = 1;
        var pageCalled = "";

        //page information that is passed between ingredient screen and another screen
        var passedPage = {
            id: "",
            foodColor: "",
            fatContent: "",
            calories :  "",
            protein :  "",
            sugars :  "",
            sodium :"",
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
              totalContents.fatContent = totalContents.fatContent + isBlank(isUndefined(data.fatContent));
              totalContents.calories = totalContents.calories + isBlank(isUndefined(data.calories));
              totalContents.protein = totalContents.protein + isBlank(isUndefined(data.protein));
              totalContents.sugars =   totalContents.sugars + isBlank(isUndefined(data.sugars));
              totalContents.sodium = totalContents.sodium + isBlank(isUndefined(data.sodium));
          },

          totalContentsSub: function (data, $http) {
              totalContents.fatContent = totalContents.fatContent - isBlank(isUndefined(data.fatContent));
              totalContents.calories =  totalContents.calories - isBlank(isUndefined(data.calories));
              totalContents.protein =  totalContents.protein - isBlank(isUndefined(data.protein));
              totalContents.sugars =  totalContents.sugars - isBlank(isUndefined(data.sugars));
              totalContents.sodium = totalContents.sodium - isBlank(isUndefined(data.sodium));
              return totalContents;
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

          //gets current page status
          getSpecificIngredient: function () {
              return (passedPage);
          },

          //get items from ingredient page and save
          setIngredient: function (data, $http) {
              x.push({
                    id: i,
                    ingName: isUndefined(data.ingName),
                    fatContent: isBlank(isUndefined(data.fatContent)),
                    foodColor: isUndefined(data.foodColor),
                    calories : isBlank(isUndefined(data.calories)),
                    protein : isBlank(isUndefined(data.protein)),
                    sugars : isBlank(isUndefined(data.sugars)),
                    sodium : isBlank(isUndefined(data.sodium)),
                    freshness: isUndefined(data.freshness),
                    quantity: isUndefined(data.quantity),
                    comments: isUndefined(data.comments)
                });
              i = i + 1;
            },

            //returns every saved ingredient for list
            getAllIngredient: function () {
                return (x);
            },

            getPageVals: function () {
                return passedPage;
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
            },
            setTotalEmpty: function(){
                totalContents.fatContent =0;
                totalContents.calories = 0;
                totalContents.protein = 0;
                totalContents.sugars = 0;
                totalContents.sodium = 0;
            },
           //empties service array
            resetArray: function () {
                x = [];
                return x;
            },

            deleteMeal: function (guid) {
                var url = "https://boiling-fire-9023.firebaseio.com/";
                var partURL = url.concat(getUID());
                var fullURL = partURL.concat("/nutrition/" + guid.$id);
                var fbMeal = new Firebase(fullURL);
                var mealObj = $firebaseObject(fbMeal);

                mealObj.$remove().then(function (ref) {
                    console.log("item deleted");
                }, function (error) {
                    console.log(error);
                })

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
        var fbMed = new Firebase("https://boiling-fire-9023.firebaseio.com"+ getUID() + "/medicine/");
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

      getMeds: function(){
        var url = "https://boiling-fire-9023.firebaseio.com/" + getUID() + "/medicine/";
        var fbObj = new Firebase(url);
        var allMeds = [];
        var num = 0;

        fbObj.orderByChild("date").on("child_added", function(snapshot){
          var currentMed = {};
          currentMed.key = snapshot.key();
          var key = currentMed.key; //do I need this?

          currentMed.name = snapshot.val().name;
          currentMed.taken = snapshot.val().taken;
          currentMed.amount = snapshot.val().amount;
          currentMed.extra = snapshot.val().extra;
          currentMed.date = snapshot.val().date;

          allMeds[num] = currentMed;
          num++;

        });

        return allMeds
      }
    };
})

app.service("NutritionService", function(){
  return{
    getNutrition: function(startDate, endDate){
      var url = "https://boiling-fire-9023.firebaseio.com/" + getUID() + "/nutrition/";
      var fbObj = new Firebase(url);
      var allMeals = [];
      //var currMeal = {};
      var num = 0;

      fbObj.orderByChild("date").on("child_added", function(snapshot){
        //This is basically a for each loop. It will go through and get

        if(new Date(snapshot.val().date) < startDate){
          console.log("date is before");
          console.log(allMeals);
        }

        else if(new Date(snapshot.val().date) > endDate){
          console.log("date is after");
          console.log(allMeals);
        }

        else {
          var currMeal = {};
          currMeal.key = snapshot.key();
          var key = currMeal.key;

          currMeal.mealName = snapshot.val().mealName;
          currMeal.meal = snapshot.val().meal;
          currMeal.date = snapshot.val().date;
          currMeal.time = snapshot.val().time;
          currMeal.comments = snapshot.val().comments;
          allMeals[num] = currMeal;

          num++;

          //currMeal.key = snapshot.key();
          //currMeal.mealName = snapshot.val().mealName;
          //allMeals.meal = currMeal;
          //console.log(snapshot.key());
          //console.log(snapshot.val().mealName);
          //console.log(snapshot.val().time);
          //console.log(allMeals);
          //console.log(currMeal);
          //console.log(allMeals);
        }
      });




      console.log(allMeals);

      return allMeals;
    }
  }
})

app.service("pullRecipeFirebaseService", function ($firebaseArray)
{
    return {
        pullRecipe: function () {
            return $firebaseArray(new Firebase("https://boiling-fire-9023.firebaseio.com/"+getUID() + "/recipe/")).$loaded();
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
