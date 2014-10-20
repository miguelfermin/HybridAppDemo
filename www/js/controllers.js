//  controllers.js
//  HybridAppDemo
//
//  Created by Miguel Fermin on 10/15/2014.
//  Copyright (c) 2014 Miguel Fermin. All rights reserved.
//
var app = angular.module('starter.controllers', []);

app.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
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

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
});

// ACI Search Controller
app.controller('SearchCtrl', function($scope, $http) {
  // ACISearchService test
  //console.log('ACISearchService - $stories: ' + $stories);
  // NOTE: once I figure out how to do it, move this data fetch logic to the 'ACISearchService' service

  // Networking
  $scope.numberOfPages  = 0;
  $scope.pageCounter = 0;
  $scope.storyCounter = 0;
  $scope.stories = [];


  $scope.loadMore = function() {
    var params = { page: $scope.pageCounter.toString()};
    $scope.pageCounter += 1;

    $http({ method: 'GET', url: 'http://dev.acindex.com/search', params: params })

      .success(function(data, status, headers) {

        if (data && data.hits && data.hits.length > 0) {
          $scope.hits_count = data.hits.length;

          if ($scope.numberOfPages === 0) {
            $scope.numberOfPages = data.nbPages;
          }

          // Load stories
          data.hits.forEach(function(hit) {
            $scope.storyCounter += 1;
            var story = {
              number: $scope.storyCounter,
              title: hit.title,
              date: hit.date,
              pub_id: hit.pub.$id,
              pub_name: hit.pub.name,
              authors: hit.authors
            };

            if (hit._highlightResult.text) {
              story.text = hit._highlightResult.text.value;
            } else {
              story.text = '_highlightResult.text was null';
            }
            $scope.stories.push(story);
          });
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      })
      .error(function(error, code) {alert("Error: " + error + ', code: ' + code);});
  };

  // $scope.moreDataCanBeLoaded = function() {
  //   console.log('$scope.moreDataCanBeLoaded = function(): ' + $scope.pageCounter );
  //   if ($scope.pageCounter === 0 || $scope.search_data.stories.length >= 20) {
  //     return true;
  //   }
  //   else {
  //     return false;
  //   }
  // };

  //Listen 'stateChangeSuccess' and continue loading data infinitely
  $scope.$on('$stateChangeSuccess', function() {
    console.log('$on($stateChangeSuccess) ... calling loadMore()...\n ');
    //$scope.loadMore();
  });

});

app.controller('SearchDetailCtrl', function($scope, $stateParams, $story) {
  // ACISearchService test
  console.log('ACISearchService - $story.pub_id: ' + $story.pub_id);
  // console.log('$stateParams.pub_id: ' + $stateParams.pub_id);
  // console.log('$stateParams.story_title: ' + $stateParams.story_title);
  // console.log('$stateParams.story_text: ' + $stateParams.story_text);
  //console.log('$stateParams.story_text: ' + $stateParams.authors);
  $scope.pub_id = $stateParams.pub_id;
  $scope.story_title = $stateParams.story_title;
  $scope.story_text = $stateParams.story_text;
});




/*
, $ionicModal
$scope.scroll_distance = '10';
  // Demo runtime setup
  $scope.openSettings = function() {
    // Form data for the login modal
    $scope.settingsData = {};
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', { scope: $scope }).then(function(modal) { $scope.modal = modal; });
    $scope.modal.show();
    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      console.log('settingsData.scroll_distance: ' + $scope.settingsData.scroll_distance);
      $scope.modal.hide();

      $scope.scroll_distance = $scope.settingsData.scroll_distance;
    };
  };
 */
