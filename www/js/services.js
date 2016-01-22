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
        },
        error: function (user, error) {

        }
      });
      return d.promise;
    },

    signup : function (email, name, password){
      var d = $q.defer();
      var user = new Parse.User();

      user.set('username', email);
      user.set('user', name);
      user.set('password', password);
      user.set('email', email);

      user.signUp(null, {
        success: function (user) {
          console.log("Account created");
          self.user = user;
          d.resolve(self.user);
        },
        error: function(user, error){
          $ionicPopup.alert({
            title:'signUp error',
            subtitle: error.message
          });
          d.reject(error);
        }
      });


      return d.promise;
    },


  };

  return self;
});
