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

function getEmail() {
    var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");
    var user = fbUser.getAuth();
    var userEmail = user.password.email;
    console.log(userEmail.replace(/[^a-zA-Z ]/g, ""));
    return (userEmail.replace(/[^a-zA-Z ]/g, ""));
}

app.service('AuthService', function ($q, $ionicPopup, $state) {
  //TODO: switch to using AngularFire
  function logOut(){
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

            console.log(email);

            fbUser.createUser({
              email: email,
              password: password
            }).then( function(userData) {
              console.log("User " + userData.uid + " created successfully!");
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
          console.log(user.password.email);

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
        logOut();
        },

      getEmail: function (){
        var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");
        return fbUser.password.email;
      }

    };

    return self;
});


app.service("addToFirebaseService", function ($firebaseArray, $firebaseObject, MealService) {

    return {
        saveNutrition: function (data, ingredients) {
            var nutritionGuid = guid();
            nutritionTable = new Firebase("https://boiling-fire-9023.firebaseio.com/" + getEmail() + "/nutrition/");
            nutritionTable = $firebaseArray(nutritionTable);

            nutritionTable.$add({
                nutritionGuid: nutritionGuid,
                meal: isUndefined(data.meal),
                date: isUndefined(data.date).toString(),
                time: isUndefined(data.time).toString(),
                comments: isUndefined(data.comments)
            });

            var x = 1;
            angular.forEach(ingredients, function (ing, index) {
                var ingredientGuid = guid(); 
                var ingredientTable = new Firebase("https://boiling-fire-9023.firebaseio.com/" + getEmail() + "/nutritionIngredient/");
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
        saveRecipe: function (data, ingredients) {
            var recipeGuid = guid();
            recipeTable = new Firebase("https://boiling-fire-9023.firebaseio.com/" + getEmail() + "/recipe/");
            recipeTable = $firebaseArray(recipeTable);

            recipeTable.$add({
                 recipeGuid: recipeGuid,
                 recipeName:  isUndefined(data.recipeName),
                 prepTime:  isUndefined(data.prepTime),
                 cookingTime:  isUndefined(data.cookingTime),
                 servesNMany:  isUndefined(data.servesNMany),
                 recipeDesc:  isUndefined(data.recipeDesc)
             });
            var x = 1;

            angular.forEach(ingredients, function (ing, index) {
                var ingredientTable = new Firebase("https://boiling-fire-9023.firebaseio.com/"+ getEmail() +"/recipeIngredient/");
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

app.service("MealService", function ($q,$ionicPopup, $firebaseObject) {
  var mealGUID;

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }



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
        'track': function (data) {
            console.log("got data");
            self.isSaving = true;
            var d = $q.defer();

            var Recipe = Parse.Object.extend("Recipe");
            //var user = AuthService.user;
            var file = data.picture ? Parse.File("photo.jpg", { base64: data.picture }) : null;

            var recipe = new Recipe();
            recipe.set("owner", "");
            recipe.set('picture', file);
            recipe.set('recipeName', data.recipeName);
            recipe.set('ingredientName', data.recipeIngredient);
            recipe.set('portionSize', parseInt(data.portionSize));
            recipe.set('created', new Date());

            recipe.save(null, {
                success: function (meal) {
                    console.log("meal tracked")
                    self.results.unshift(recipe);
                    d.resolve(recipe);
                },
                error: function(item, error){
                $ionicPopup.alert({
                    title: "error with meal save",
                    subTitle: error.message
                });
                d.reject(error);
            }
        });
            return d.promise;
        },

      'add': function(data){
        var mealGuid = guid();
        console.log("got data");
        var url = "https://boiling-fire-9023.firebaseio.com/Meal/";
        var fullURL = url.concat(mealGuid.toString());
        var fbMeal = new Firebase(fullURL);
        var mealObj = $firebaseObject(fbMeal);
        var user = fbMeal.getAuth();
        var userEmail = user.password.email;

        mealObj.guid = mealGuid;
        mealObj.user = userEmail;
        mealObj.mealName = data.mealName;
        mealObj.mealContents = data.mealContents;
        mealObj.foodType = data.foodType;
        mealObj.date = data.date;
        mealObj.time = data.time;
        mealObj.comment = data.comments;

        console.log("user email ", userEmail);

        mealObj.$save().then(function(fbMeal){
          fbMeal.key() === mealObj.$id;
        }), function(error){
          console.log(error);
        }
        mealGUID = mealGuid;
      },

      getMealGuid: function(){
       return mealGUID;
     }

    };

    return self;
});

app.service("RecipeService", function ($q,$ionicPopup) {
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
        'track': function (data) {
            console.log("got data");
            self.isSaving = true;
            var d = $q.defer();

            var Recipe = Parse.Object.extend("Recipe");

            var recipe = new Recipe();
            recipe.set("owner", "");
            recipe.set('picture', file);
            recipe.set('recipeName', data.recipeName);
            recipe.set('ingredientName', data.recipeIngredient);
            recipe.set('portionSize', parseInt(data.portionSize));
            recipe.set('created', new Date());

            recipe.save(null, {
                success: function (meal) {
                    console.log("meal tracked")
                    self.results.unshift(recipe);
                    d.resolve(recipe);
                },
                error: function(item, error){
                $ionicPopup.alert({
                    title: "error with meal save",
                    subTitle: error.message
                });
                d.reject(error);
            }
        });
            return d.promise;
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
              console.log(totalContents.fatContent);
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
                passedPage.id = isBlank(isUndefined(item.brand_id));
                passedPage.ingName = isBlank(isUndefined(item.item_name));
                passedPage.foodColor = isBlank(isUndefined(item.foodColor));
                passedPage.freshness = isBlank(isUndefined(item.freshness));
                passedPage.fatContent = isBlank(isUndefined(item.nf_total_fat));
                passedPage.calories = isBlank(isUndefined(item.nf_calories));
                passedPage.protein = isBlank(isUndefined(item.nf_protein));
                passedPage.sugars = isBlank(isUndefined(item.nf_sugars));
                passedPage.sodium = isBlank(isUndefined(item.nf_sodium));
                passedPage.quantity = (isBlank(isUndefined(item.nf_serving_size_qty))  + " "+ isBlank(isUndefined(item.nf_serving_size_unit)));
                passedPage.comments = "";
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
        var fbMed = new Firebase("https://boiling-fire-9023.firebaseio.com"+ getEmail() + "/medicine/");
        var medObj = $firebaseObject(fbMed);

        medObj.$loaded()
          .then(function (data) {
              console.log(data == medObj);
              //return medObj;
          }).catch(function (error) {
              console.log(error);
          });

    }

    var self = {
        "add": function (data) {
            var medGUID = guid();
            var url = "https://boiling-fire-9023.firebaseio.com/"+ getEmail() + "/medicine/";
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
        }
    };

    return self;
});

app.service("pullRecipeFirebaseService", function ($firebaseArray)
{
    var recipeTable = new Firebase("https://boiling-fire-9023.firebaseio.com/"+getEmail() + "/recipe/");
    recipeTable = $firebaseArray(recipeTable);

    return {
        pullRecipe: function () {
            return recipeTable;
            // May have input var "data"
            //var recipeGuid = guid();      //User ID not GUID
               /*     recipeTable.$getRecord(); //ASK what is getRecord key?
                "recipe": {                         //ASK does it put the data in data?
                    recipeGuid: recipeGuid,
                    recipeName: isUndefined(data.recipeName),
                    prepTime: isUndefined(data.prepTime),
                    cookingTime: isUndefined(data.cookingTime),
                    servesNMany: isUndefined(data.servesNMany),
                    recipeDesc: isUndefined(data.recipeDesc)
                }
            });
*/
        }
    };
})


app.service("pullMedsFirebaseService", function ($firebaseArray) {
    var medTable = new Firebase("https://boiling-fire-9023.firebaseio.com/" + getEmail() + "/medicine/");
    medTable = $firebaseArray(medTable);
    console.log(medTable);
    return {
        pullMeds: function () {
            return medTable;
        }
    };
})

app.service("pullNutritionFirebaseService", function ($firebaseArray) {
    var nutritionTable = new Firebase("https://boiling-fire-9023.firebaseio.com/" + getEmail() + "/nutrition/");
    nutritionTable = $firebaseArray(nutritionTable);

    return {
        pullNutrition: function () {
            console.log(nutritionTable);
            return nutritionTable;
        }
    };
})