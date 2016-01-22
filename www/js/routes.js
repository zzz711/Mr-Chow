angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
      
        
    .state('recipeCardHolder', {
      url: '/page2',
      templateUrl: 'templates/recipeCardHolder.html',
      controller: 'recipeCardHolderCtrl'
    })
        
      
    
      
        
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })
        
      
    
      
        
    .state('signup', {
      url: '/page4',
      templateUrl: 'templates/signup.html',
      controller: 'signupCtrl'
    })
        
      
    
      
    .state('main', {
      url: '/page5',
      abstract:true,
      templateUrl: 'templates/main.html'
    })
      
    
      
        
    .state('main.recipeBook', {
      url: '/page10',
      views: {
        'tab1': {
          templateUrl: 'templates/recipeBook.html',
          controller: 'recipeBookCtrl'
        }
      }
    })
        
      
    
      
        
    .state('friedChicken', {
      url: '/page11',
      templateUrl: 'templates/friedChicken.html',
      controller: 'friedChickenCtrl'
    })
        
      
    
      
        
    .state('spaghetti', {
      url: '/page12',
      templateUrl: 'templates/spaghetti.html',
      controller: 'spaghettiCtrl'
    })
        
      
    
      
        
    .state('main.addARecipe', {
      url: '/page13',
      views: {
        'tab2': {
          templateUrl: 'templates/addARecipe.html',
          controller: 'addARecipeCtrl'
        }
      }
    })
        
      
    
      
        
    .state('main.dailyNutrition', {
      url: '/page14',
      views: {
        'tab3': {
          templateUrl: 'templates/dailyNutrition.html',
          controller: 'dailyNutritionCtrl'
        }
      }
    })
        
      
    
      
        
    .state('main.myMeds', {
      url: '/page15',
      views: {
        'tab4': {
          templateUrl: 'templates/myMeds.html',
          controller: 'myMedsCtrl'
        }
      }
    })
        
      
    
      
        
    .state('addMedicine', {
      url: '/page16',
      templateUrl: 'templates/addMedicine.html',
      controller: 'addMedicineCtrl'
    })
        
      
    
      
        
    .state('addNutrition', {
      url: '/page9',
      templateUrl: 'templates/addNutrition.html',
      controller: 'addNutritionCtrl'
    })
        
      
    
      
        
    .state('11/1/2015', {
      url: '/page20',
      templateUrl: 'templates/11/1/2015.html',
      controller: '11/1/2015Ctrl'
    })
        
      
    
      
        
    .state('11/2/2015', {
      url: '/page21',
      templateUrl: 'templates/11/2/2015.html',
      controller: '11/2/2015Ctrl'
    })
        
      
    
      
        
    .state('11/3/2015', {
      url: '/page22',
      templateUrl: 'templates/11/3/2015.html',
      controller: '11/3/2015Ctrl'
    })
        
      
    
      
        
    .state('main.settings', {
      url: '/page17',
      views: {
        'tab6': {
          templateUrl: 'templates/settings.html',
          controller: 'settingsCtrl'
        }
      }
    })
        
      
    
      
        
    .state('myAccount', {
      url: '/page18',
      templateUrl: 'templates/myAccount.html',
      controller: 'myAccountCtrl'
    })
        
      
    
      
        
    .state('shareMyData', {
      url: '/page19',
      templateUrl: 'templates/shareMyData.html',
      controller: 'shareMyDataCtrl'
    })
        
      
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/page2');

});