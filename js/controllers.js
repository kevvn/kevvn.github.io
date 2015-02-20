var app = angular.module('starter.controllers', []);
// Parse id and rest api key
app.value('PARSE_CREDENTIALS', {
    APP_ID: 'qCKMCAPQBXhmMghKpKjkkNGhejWQ5w7Sm2NpYmnH',
    REST_API_KEY: 'QOnuKyBBU5eWfugZLIDHEoFMzMf6N8mmrZyqc6tR',
    SESSION_TOKEN: 'pnktnjyb996sj4p156gjtp4im'
})

app.controller('AppCtrl', ['$scope', 'Users', '$state', function ($scope, Users, $state, $ionicModal) {
  // Form data for the login modal
  var currentUser = Parse.User.current();
  console.log(currentUser.id);
  //var userObject = currentUser.id;
  if(currentUser){
    var userObject = currentUser.id;

    Parse.User.become(currentUser._sessionToken).then(function (user) {
    $scope.currentLoggedin = currentUser;

    }, function (error) {
  // The token could not be validated.
      alert("Could not validate Token");
    });

  //  console.log(currentUser.attributes.username);
//    console.log($scope);
  }else{

    console.log("NO USErS");
  }



   $scope.logout = function(){
     Parse.User.logOut();

     var currentUser = Parse.User.current();
   }

}])


app.controller('PostCtrl', ['$scope', 'PostFactory', '$state', function ($scope, PostFactory, $state) {

    $scope.newPost = function () {

        console.log($scope.name);

        PostFactory.create({ name: $scope.name, url: $scope.url, points: 0, content: $scope.content, tags: $scope.tags, tags2: $scope.tags2}).success(function (data) {
            console.log("GOOD");
            alert("Post successful");
            $state.go('app.playlists');

        })

        console.log("SAVED!");

     }

}])






app.factory('PostFactory', ['$http', 'PARSE_CREDENTIALS', function ($http, PARSE_CREDENTIALS) {

    return {

        // CRUD operations, access Parse database
        create: function (data) {

            return $http.post('https://api.parse.com/1/classes/PostFactory', data, {
                headers: {
                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                    'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
                    'Content-Type': 'application/json'
                }
            });
        },

        get: function (id) {
            return $http.get('https://api.parse.com/1/classes/PostFactory/' + id, {
                headers: {
                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                    'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
                }
            });
        },

        getAll: function () {
            return $http.get('https://api.parse.com/1/classes/PostFactory', {
                headers: {
                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                    'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
                }
            });
        },

        update: function (id, data) {
            return $http.put('https://api.parse.com/1/classes/PostFactory/' + id, data, {
                headers: {
                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                    'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
                    'Content-Type': 'application/json'
                }
            });

        },

        delete: function (id) {
            return $http.delete('https://api.parse.com/1/classes/PostFactory' + id, {
                headers: {
                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                    'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
                    'Content-Type': 'application/json'
                }
            });
        }
    }

}])


app.controller('UserCtrl', ['$scope', 'Users', '$state', function ($scope, Users, $state, $ionic) {



    $scope.doSignup = function () {

        console.log($scope.username);

        var user = new Parse.User();
          user.set("username", $scope.username);
          user.set("password", $scope.password);


          user.signUp(null, {
            success: function(user) {
              // Hooray! Let them use the app now.

              $state.go('app.playlists');

            },
            error: function(user, error) {
              // Show the error message somewhere and let the user try again.
              alert("Error: " + error.code + " " + error.message);
            }
            });

        }





         $scope.doLogin = function () {

             console.log($scope.username);
             var currentUser = $scope.username;
             var currentPass = $scope.password;

             Parse.User.logIn($scope.username, $scope.password, {
               success: function(user) {

                 $state.go('app.playlists');
               },
               error: function(user, error) {
               if(error.code == 101){
                 alert(error.message);

               }
    console.log(error);
                }
                }             );



          }

}])

/* Log in stuff?  */
app.factory('Users', ['$http', 'PARSE_CREDENTIALS', function ($http, PARSE_CREDENTIALS) {

    return {

        // CRUD operations, access Parse database


        update: function (id, data) {
            return $http.put('https://api.parse.com/1/classes/favorite' + id, data, {
                headers: {
                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                    'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
                    'Content-Type': 'application/json'
                }
            });

        },



    }

}])




app.controller('PlaylistsCtrl', ['$scope', 'PostFactory', function ($scope, PostFactory, $state) {

    $scope.playlists = [];
    $scope.$watch("orderProp", function(newValue, oldValue) {
    if ($scope.orderProp) {

    }
    else{
      $scope.orderProp = '-points';
    }
  });
    PostFactory.getAll().success(function (data) {


        console.log(data.results.length);

        // push data into playlists array
        for (var i = 0; i < data.results.length; i++) {

            //console.log("GHGH");

            $scope.playlists.push({objectId: data.results[i].objectId, title: data.results[i].name, points: data.results[i].points,
                tags: data.results[i].tags,  tags2: data.results[i].tags2 });

        }

    //    console.log(playlists.tags);
    })



    $scope.reloadPage = function(){window.location.reload();}




}])


app.controller('PlaylistCtrl', ['$scope','PostFactory', 'Users', '$stateParams',
  function($scope, PostFactory,Users, $state) {

    console.log($scope);

    PostFactory.get($state.playlistId).success(function (data) {


      $scope.title = data.name;
      $scope.content = data.content;
      $scope.points = data.points;
      $scope.url = data.url;

  })

  $scope.favorite = function() {
    if($scope.currentLoggedin){
      console.log($scope.currentLoggedin.id );

      var favorite = Parse.Object.extend("favorite");
      var privateNote = new favorite();
      privateNote.set("favorite", $state.playlistId);
      privateNote.set("content", $scope.currentLoggedin.id );
      privateNote.save();

    }
    else{

      alert("Please log in to favorite articles");
    }

  }
  $scope.upvote = function () {
    if($scope.currentLoggedin){
      PostFactory.update($state.playlistId ,{points: $scope.points+1}).success(function (data){
        console.log(data);

      })
    }
    else{

      alert("Please log in to favorite articles");
    }
  }
    $scope.report = function () {
      if($scope.currentLoggedin){
        alert("This article has been reported");
      }
      else{

        alert("Please log in to report articles");
      }
    }

}]);



app.controller('FavoriteCtrl', ['$scope','PostFactory', 'Users', '$stateParams',
  function($scope, PostFactory,Users, $state) {
  console.log($state.userId);
  var current = $state.userId;
    var favorite = Parse.Object.extend("favorite");
    var query = new Parse.Query(favorite);

    query.equalTo("content", current);

    query.find({
      success: function(results) {
        alert("Successfully retrieved " + results.length + " scores.");
    // Do something with the returned Parse.Object values
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        alert(object.id + ' - ' + object.get($state.userId));
      }
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
    console.log(query);



}]);
