/**
 * Created by zzz711 on 2/7/16.
 */

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
