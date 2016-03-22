angular.module('app.routes', [])

.config(function ($stateProvider, $urlRouterProvider) {
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
          abstract: true,
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

        .state('viewRecipe', {
            url: '/ViewRecipe',
            templateUrl: 'templates/viewRecipe.html',
            controller: 'viewRecipeCtrl'
        })

      .state('addARecipe', {
          url: '/page13',
                  templateUrl: 'templates/addARecipe.html',
                  controller: 'addARecipeCtrl'
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

      .state('viewNutrition', {
          url: '/ViewNutrition',
          templateUrl: 'templates/viewNutrition.html',
          controller: 'viewNutritionCtrl'
      })

      .state('main.myMeds', {
          url: '/page15',
          views: {
              'tab4': {
                  templateUrl: 'templates/myMeds.html',
                  controller: 'medPullCtrl'
              }

          }
      })

      .state('addAnIngredientRecipe', {
          url: '/page24',
          templateUrl: 'templates/addIngredientRecipe.html',
          controller: 'addIngredientRecipeCtrl'
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

      .state('main.shareMyData', {
          url: '/page19',
          views: {
              'tab2': {
          templateUrl: 'templates/shareMyData.html',
          controller: 'shareMyDataCtrl'
              }
          }
      })

      .state('changePW', {
          url: '/page30',
          templateUrl: 'templates/changePW.html',
          controller: 'changePWCtrl'
      });

    $urlRouterProvider.otherwise('/page2');

});
