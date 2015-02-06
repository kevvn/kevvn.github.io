angular.module('starter.controllers', [])


.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };
  
  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
  
  $scope.post = function(path) {
	  $rootScope.apply(function(){
		  
		  $location.path("/template/browse.html");
		  $location.replace();
	  });
	  alert(path);
	   };
  

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
 
  
})





.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'How to Cook', id: 1 },
    { title: 'Another Tutorial', id: 2 },
    { title: 'Tutorials on Tutorials', id: 3 },
    { title: 'Have you wanted to learn about', id: 4 },
    { title: 'Learn to rap', id: 5 },
    { title: 'How to not make an app', id: 6 }
  ];
})


