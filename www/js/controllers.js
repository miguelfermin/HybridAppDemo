//  controllers.js
//  HybridAppDemo
//
//  Created by Miguel Fermin on 10/15/2014.
//  Copyright (c) 2014 Miguel Fermin. All rights reserved.
//
var app = angular.module('starter.controllers', []);

// First story search method, without using a service, all work done in the controller. Kept for reference only
app.controller('SearchCtrl', function($scope, $http, $ionicScrollDelegate) {
  $scope.numberOfPages  = 0;
  $scope.pageCounter = 0;
  $scope.storyCounter = 0;
  $scope.stories = [];

  $scope.loadMore = function() {
    var params = {page: $scope.pageCounter.toString()};
    $scope.pageCounter += 1;
    $http({ method: 'GET', url: 'http://dev.acindex.com/search', params: params })

      .success(function(data, status, headers) {
        if (data && data.hits && data.hits.length > 0) {
          $scope.hits_count = data.hits.length;
          if ($scope.numberOfPages === 0) {
            $scope.numberOfPages = data.nbPages;
          }
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
            if (hit._highlightResult.text) {story.text = hit._highlightResult.text.value;}
            else {story.text = '_highlightResult.text was null';}
            $scope.stories.push(story);
          });
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $ionicScrollDelegate.scrollToRememberedPosition();
        }
      })
      .error(function(error, code) {alert("Error: " + error + ', code: ' + code);});
  };
  
  //Listen 'stateChangeSuccess' and continue loading data infinitely
  $scope.$on('$stateChangeSuccess', function() {
    //$scope.loadMore();
  });
});

app.controller('SearchDetailCtrl', function($scope, $stateParams) {
  $scope.pub_id = $stateParams.pub_id;
  $scope.story_title = $stateParams.story_title;
  $scope.story_text = $stateParams.story_text;
});

// Second story search method, using a service to perform the loading work and share data between controllers correctly
app.controller('StoriesController', function($scope, $ionicScrollDelegate, StoriesService) {

  //Handle promise
  var delegate = $ionicScrollDelegate;
  var promise = StoriesService.getStories();

  promise.then(
    function(stories) {
      delegate.scrollToRememberedPosition();
      $scope.stories = stories;
    },
    function(failedInfo) {
      alert('failedInfo: ' + failedInfo);
    });
});

app.controller('StoryController', function($scope, story) {
  console.log('story: ' + story.title);
  $scope.story = story;
});