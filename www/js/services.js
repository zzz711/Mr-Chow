var app = angular.module('app.services', ['firebase']);

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
    var firebaseObj = new Firebase("https://boiling-fire-9023.firebaseio.com/");
    var fb = $firebaseArray(firebaseObj);

    return{
        saveRecipe: function (data, ingredients) {
            console.log(data)
            fb.$add({
                recipeName: data.recipeName,
                prepTime: data.prepTime,
                cookingTime: data.cookingTime,
                servesNMany: data.servesNMany,
                recipeDesc: data.recipeDesc,
             }).then(function (ref) {
                console.log(ref);
            }, function (error) {
                console.log("Error:", error);
            });
        }

    };


})


app.service("MealService", function ($q,$ionicPopup) {
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


        return {
            setIngredient: function (data, $http) {
                x.push(
                            {
                                id: i,
                                ingName: data.ingName,
                                ingInstructions: data.ingInstructions,
                                quantity: data.quantity,
                                measurement: data.measurement
                            }

                    );
                i = i + 1;
                console.log("YELLKAFHLKSHLDKJAHSJKDH", x);
            },

            getAllIngredient: function () {
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
        }

        };
    });
