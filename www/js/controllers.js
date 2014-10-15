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
app.controller('SearchCtrl', function($scope, $http, $stories) {

  // ACISearchService test
  console.log('ACISearchService - $stories: ' + $stories);

  // NOTE: once I figure out how to do it, move this data fetch logic to the 'ACISearchService' service
  
  var numberOfPages  = 0;
  var pageCounter = 0;
  $scope.stories = [];

  // Load stories from aci server.
  $scope.loadMore = function() {
    // console.log('pageCounter: ' + pageCounter.toString());
    // console.log('numberOfPages: ' + numberOfPages);
    // console.log('stories.length: ' + $scope.stories.length + '\n ');

    // Keep track of pages to avoid going out of range
    pageCounter += 1;

    // Search parameters
    var params = {
      page: pageCounter.toString()
    };

    $http({ method: 'GET', url: 'http://dev.acindex.com/search', params: params })

      .success(function(data, status, headers) {
        
        if (data && data.hits && data.hits.length > 0) {
          if (numberOfPages === 0) {
            //console.log('Number of pages in search: ' + data.nbPages);
            numberOfPages = data.nbPages;
          }

          // Load stories
          data.hits.forEach(function(hit) {
            $scope.stories.push({
              title: hit.title,
              text: hit._highlightResult.text.value,
              date: hit.date,
              pub_id: hit.pub.$id,
              pub_name: hit.pub.name,
              authors: hit.authors
            });
            //console.log(hit);
          });

          // Broadcast that we're done loading data
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      })

      .error(function(error, code) {
        if (code === 404) {
          alert("Error: " + error + ' (' + code + '). There are no more stories to load from the server');
        }
        else {
          alert("Error: " + error + ', code: ' + code);
        }
      });
  };

  // Stop infinite scroll once there is no more data to load
  $scope.moreDataCanBeLoaded = function() {
    if (pageCounter == numberOfPages) {
      return false;
    } else {
      return true;
    }
  };

  // Listen 'stateChangeSuccess' and continue loading data infinitely
  $scope.$on('$stateChangeSuccess', function() {
    $scope.loadMore();
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


