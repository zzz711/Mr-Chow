var app = angular.module('app.services', ['ngCordova', 'firebase', 'ngRoute', 'jsonFormatter']);

app.service('AuthService', function ($q, $ionicPopup, $state) {
    var self = {
        user: null,
        login: function (email, password) {
            var d = $q.defer();
            var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");

          //if (fbUser.getAuth()) {
          //  fbUser.unauth();
          //}

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

        logOut: function(){
          var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");

          fbUser.unauth();
        }
    };

    return self;
});

function isUndefined(val) {
    if (angular.isUndefined(val)) {
        return null
    }
    else
        return val
}

app.service("addRecipeFirebaseService", function ($firebaseArray) {
    var recipeTable = new Firebase("https://boiling-fire-9023.firebaseio.com/recipe/recipe");

    recipeTable = $firebaseArray(recipeTable);


    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
    }

    return{
        saveRecipe: function (data, ingredients) {
            var recipeGuid = guid();
            data.recipe = recipeTable.$add({
             "recipe": {
                 recipeGuid: recipeGuid,
                 recipeName:  isUndefined(data.recipeName),
                 prepTime:  isUndefined(data.prepTime),
                 cookingTime:  isUndefined(data.cookingTime),
                 servesNMany:  isUndefined(data.servesNMany),
                 recipeDesc:  isUndefined(data.recipeDesc)
             }
            });
            var x = 1;

            angular.forEach(ingredients, function (ing, index) {
                var ingredientTable = new Firebase("https://boiling-fire-9023.firebaseio.com/recipe/ingredient/"+recipeGuid+x);
                ingredientTable = $firebaseArray(ingredientTable);

                var ingredientGuid = guid();
                x = x + 1;
                ingredientTable.$add({
                            recipeGuid: recipeGuid,
                            ingredientGuid: ingredientGuid,
                            ingName:  isUndefined(ing.ingName),
                            ingInstructions:  isUndefined(ing.ingInstructions),
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

        var passedPage = {
            id: '',
            ingName: '',
            ingInstructions: '',
            fatContent: '',
            calories :  '',
            protein :  '',
            sugars :  '',
            sodium :'',
            freshness: '',
            quantity: '',
            comments: ''
        };

      function guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
      }


        return {
          add: function(data){
            var ingGuid = guid();
            var url = "https://boiling-fire-9023.firebaseio.com/Ingredient/";
            var fullURL = url.concat(ingGuid.toString());
            var fbIng = new Firebase(fullURL);
            var ingObj = $firebaseObject(fbIng);
            var user = fbIng.getAuth();
            var userEmail = user.password.email;

            ingObj.foodName = data.foodName;
            ingObj.foodColor = data.foodColor;
            ingObj.foodType = data.foodType;
            ingObj.fatContent = data.fatContent;
            ingObj.calories = data.calories;
            ingObj.protein = data.protein;
            ingObj.sugars = data.sugars;
            ingObj.sodium = data.sodium;
            ingObj.freshness = data.freshness;
            ingObj.comments = data.comments;
            ingObj.user = userEmail;

            ingObj.$save().then(function(ref){
              ref.key()=== ingObj.$id;
            }).catch(function(error){
              console.log(error);
            })

          },

            setIngredient: function (data, $http) {
                x.push({
                    id: i,
                    ingName: data.ingName,
                    ingInstructions: data.ingInstructions,
                    fatContent: data.fatContent,
                    calories : data.calories,
                    protein : data.protein,
                    sugars : data.sugars,
                    sodium : data.sodium,
                    freshness: data.freshness,
                    quantity: data.quantity,
                    comments: data.comments
                });
                i = i + 1;
            },

            getAllIngredient: function () {
                console.log(x);
                return (x);
            },

            getSpecificIngredient: function () {
                return (passedPage);
            },

            getPageVals: function () {
                return passedPage;
            },

            setPageVals: function(item){
                passedPage.id = isUndefined(item.brand_id);
                passedPage.ingName = isUndefined(item.item_name);
                passedPage.ingInstructions = "";
                passedPage.freshness = "";
                passedPage.fatContent = isUndefined(item.nf_total_fat);
                passedPage.calories = isUndefined(item.nf_calories);
                passedPage.protein = isUndefined(item.nf_protein);
                passedPage.sugars = isUndefined(item.nf_sugars);
                passedPage.sodium = isUndefined(item.nf_sodium);
                passedPage.quantity = (isUndefined(item.nf_serving_size_qty)  + " "+ isUndefined(item.nf_serving_size_unit));
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
                passedPage.ingInstructions = val.ingInstructions;
                passedPage.freshness = val.freshness;
                passedPage.fatContent = val.fatContent;
                passedPage.calories = val.calories;
                passedPage.protein = val.protein;
                passedPage.sugars = val.sugars;
                passedPage.sodium = val.sodium;
                passedPage.quantity = val.quantity;
                passedPage.comments = val.comments;
                console.log(passedPage);

                var index = x.indexOf(val);
                x.splice(index, 1);
            },
            setEmpty: function () {
                passedPage.id = "";
                passedPage.ingName = "";
                passedPage.ingInstructions = "";
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
            resetArray: function () {
                x = new Array;
                return x;
            }

        };
    });

app.service("medicineService", function($q, $firebaseObject){
  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  function logDate(){
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    var fullDate = month + "/" + day + "/" + year;
    return fullDate;

  }

  function load(){
    var fbMed = new Firebase("https://boiling-fire-9023.firebaseio.com/Medicine/");
    var medObj = $firebaseObject(fbMed);

    medObj.$loaded()
      .then(function(data){
        console.log(data == medObj);
        //return medObj;
      }).catch(function(error){
      console.log(error);
    });

  }

  var self = {
     "add" : function(data)
      {
        var medGUID = guid();
        var url = "https://boiling-fire-9023.firebaseio.com/Medicine/";
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

    var recipeTable = new Firebase("https://boiling-fire-9023.firebaseio.com/recipe/recipe");

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

    var MedTable = new Firebase("https://boiling-fire-9023.firebaseio.com/Medicine");

    MedTable = $firebaseArray(MedTable);

    return {

        pullMeds: function () {

            return MedTable;
            
        }



    };
})