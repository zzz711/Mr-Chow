
angular.module('app', ['ionic','firebase', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    Parse.initialize("cj9KfX25Ec29OSvzrFc3oPoZpHUd7AXAZOriYnmH", "9CC8zjfXD9HT0x4aYMViEYOzXSU2OUIPQ9QFrwnw");
  });
})


