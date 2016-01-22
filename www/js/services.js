angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])

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
            title:"Login Error"
            //subtitle: error.message
          });
          console.log(error);
          d.reject(error);
        }
      });
      return d.promise;
    },

    signup : function (name, email, password){
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
            title:"Account Created",
            subtitle:"Your account has been successfully created."
          });
          $state.go("login");
        },
        error: function(user, error){
          $ionicPopup.alert({
            title:'Signup error',
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
