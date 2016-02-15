var app = angular.module('app.services', ['ngCordova', 'firebase']);

app.service('AuthService', function ($q, $ionicPopup, $state) {
    var self = {
        user: null,
        login: function (email, password) {
            var d = $q.defer();
            var fbUser = new Firebase("https://boiling-fire-9023.firebaseio.com/");

          if (fbUser.getAuth()) {
            fbUser.unauth();
          }

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

        }
    };

    return self;
});


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
                 recipeName: data.recipeName.$viewValue,
                 prepTime: data.prepTime.$viewValue,
                 cookingTime: data.cookingTime.$viewValue,
                 servesNMany: data.servesNMany.$viewValue,
                 recipeDesc: data.recipeDesc.$viewValue,
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
                            ingName: ing.ingName,
                            ingInstructions: ing.ingInstructions,
                            quantity: ing.quantity,
                            measurement: ing.measurement
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
        var user = fbMeal.getAuth(); //Can I do this?
        var userEmail = user.password.email;

        mealObj.guid = mealGuid;
        mealObj.user = userEmail;
        mealObj.mealName = data.mealName;
        mealObj.mealContents = data.mealContents;
        mealObj.foodType = data.foodType;
        mealObj.date = data.date;
        mealObj.time = data.time;
        mealObj.comment = data.comments;

        console.log(userEmail);

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
            //var user = AuthService.user;
            //var file = data.picture ? Parse.File("photo.jpg", { base64: data.picture }) : null;

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

    app.service('addIngredientService', function ($q) {
        var x = [];
        var i = 1;

        var passedPage = {
            id: '',
            ingName: '',
            ingInstructions: '',
            quantity: '',
            measurement: ''
        };

      var self = {
        'add': function (data) {
          var fbIng = new Firebase("https://boiling-fire-9023.firebaseio.com/Ingredients");

        }
      };

        return {
            setIngredient: function (data, $http) {
                x.push({
                                id: i,
                                ingName: data.ingName,
                                ingInstructions: data.ingInstructions,
                                quantity: data.quantity,
                                measurement: data.measurement
                            });
                i = i + 1;
            },

            getAllIngredient: function () {
                console.log(x)
                return (x);
            },

            getSpecificIngredient: function () {
                return (passedPage);
            },

            getPageVals: function () {
                return passedPage;
            },


            deleteSpecificIngredient: function (val) {
                var index = x.indexOf(val);
                x.splice(index, 1);
                console.log(x);
                return x;
            },

            setSpecificIngredient: function (val) {
                passedPage.id = val.id;
                passedPage.ingName = val.ingName;
                passedPage.ingInstructions = val.ingInstructions;
                passedPage.quantity = val.quantity;
                passedPage.measurement = val.measurement;
                console.log(passedPage);


                var index = x.indexOf(val);
                x.splice(index, 1);
                console.log(x);
            },
            setEmpty: function () {
                passedPage.id = "";
                passedPage.ingName = "";
                passedPage.ingInstructions = "";
                passedPage.quantity = "";
                passedPage.measurement = "";
                return passedPage;
            },
            resetArray: function () {
                x = [];
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

  function add(data){
    var medGUID = guid();
    var url =  "https://boiling-fire-9023.firebaseio.com/Medicine/";
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

    medObj.$save().then(function(fbMed){
      fbMed.key() === medObj.$id;
    }), function(error){
     console.log(error);
    }
  }
});
