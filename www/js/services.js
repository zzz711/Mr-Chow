var app = angular.module('app.services', [])

.service('AuthService', function ($q, $ionicPopup, $state) {
    var self = {
        user: null,
        login: function (email, password) {
            var d = $q.defer();

            Parse.User.logIn(email, password, {
                success: function (user) {
                    console.log("login successful");
                    $state.go("main.recipeBook");
                },
                error: function (user, error) {
                    $ionicPopup.alert({
                        title: "Login Error"
                        //subtitle: error.message
                    });
                    console.log(error);
                    d.reject(error);
                }
            });
            return d.promise;
        },

        signup: function (name, email, password) {
            var d = $q.defer();
            var user = new Parse.User();

            var currentUser = Parse.User.current();
            if (currentUser) {
                Parse.User.logOut();
            }
            var uname = email;

            console.log(email);
            user.set('username', uname);
            user.set('email', email);
            user.set('name', name);
            user.set('password', password);


            user.signUp(null, {
                success: function (user) {
                    console.log("Account created");
                    self.user = user;
                    d.resolve(self.user);
                    $ionicPopup.alert({
                        title: "Account Created",
                        subtitle: "Your account has been successfully created."
                    });
                    $state.go("login");
                },
                error: function (user, error) {
                    $ionicPopup.alert({
                        title: 'Signup error',
                        //subtitle: error.message
                    });
                    console.log(error);
                    d.reject(error);
                }
            });


            return d.promise;
        },


    };

    return self;
});

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

