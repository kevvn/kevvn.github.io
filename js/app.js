// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
      Parse.initialize("qCKMCAPQBXhmMghKpKjkkNGhejWQ5w7Sm2NpYmnH", "NCteUlF8BFnxNniGAi6JqxbxxL5hKcUXlR4uECnn");

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider



  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.help', {
    url: "/help",
    views: {
      'menuContent': {
        templateUrl: "templates/help.html"
      }
    }
  })

  .state('app.login', {
    url: "/login",
    views: {
      'menuContent': {
        templateUrl: "templates/login.html"
      }
    }
  })



  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })
  .state('app.post', {
    url: "/post",
    views: {
      'menuContent': {
        templateUrl: "templates/post.html",
		controller: 'PostCtrl'
      }
    }
  })

  .state('app.404', {
    url: "/404",
    views: {
      'menuContent': {
        templateUrl: "templates/404.html"
      }
    }
  })

    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.playlist', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html" //,
      //  controller: 'PlaylistCtrl'
      }
    }

    })

  .state('app.favorites', {
    url: "/favorites/:userId",
    views: {
      'menuContent': {
        templateUrl: "templates/favorites.html",
        controller: 'FavoriteCtrl'
      }
    }

  })

  .state('app.mypost', {
    url: "/mypost/:userId",
    views: {
      'menuContent': {
        templateUrl: "templates/mypost.html",
        controller: 'MyPostCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});
