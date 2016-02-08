/**
 * Created by zzz711 on 2/8/16.
 */

var app = angular.module('app.services', ['ngCordova', 'firebase']);

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
    },

    'add': function(data){
      console.log("got data");
      var fbMeal = new Firebase("https://boiling-fire-9023.firebaseio.com/Meal");
      var mealObj = firebase(fbMeal);
      var user = fbMeal.getAuth(); //Can I do this?
      var uid = user.uid;

      //mealObj.user: uid;
      //mealObj.mealName: data.mealName;
      //mealObj.mealContents: data.mealContents;
      //mealObj.foodType: data.foodType;
      //mealObj.date: data.date;
      //mealObj.time: data.time;
      //mealObj.comment : data.comments;
      //
      //mealObj.save().then(function(fbMeal){
      //  fbMeal.key() === mealObj.$id;
      //}), function(error){
      //  console.log(error);
      //}

    }

  };

  return self;
});
