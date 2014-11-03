//  controllers.js
//  HybridAppDemo
//
//  Created by Miguel Fermin on 10/15/2014.
//  Copyright (c) 2014 Miguel Fermin. All rights reserved.
//
var app = angular.module('starter.controllers', []);

// Search Filter Controller
app.controller('SearchFilterCtrl', function($scope, $http, $ionicScrollDelegate) {
  // Imperfect stories load code, still using it for the show the search filer
  $scope.numberOfPages  = 0;
  $scope.pageCounter = 0;
  $scope.storyCounter = 0;
  $scope.stories = [];
  $scope.loadMore = function() {
    var params = {page: $scope.pageCounter.toString()};
    console.log('$scope.pageCounter: ' + $scope.pageCounter);
    $scope.pageCounter += 1;
    $http({ method: 'GET', url: 'http://dev.acindex.com/search', params: params })
      .success(function(data, status, headers) {
        if (data && data.hits && data.hits.length > 0) {
          $scope.hits_count = data.hits.length;
          if ($scope.numberOfPages === 0) $scope.numberOfPages = data.nbPages;
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
  $scope.filterSearch = function() {
    // This needs improvements; it isn't dynamic, when user deletes words it doesn't reload list...
    console.log('$scope.search: ' + $scope.search);
    $scope.stories = $scope.stories
    // The filter() method creates a new array with all elements that pass the test implemented by the provided function.
    .filter(function(item) {
      console.log('item: ' + item.title);
      // The indexOf() method returns the index within the calling String object of the first occurrence 
      // of the specified value, starting the search at fromIndex. Returns -1 if the value is not found.
      return (!$scope.search || item.title.toLowerCase().indexOf($scope.search.toLowerCase()) > -1);
    });
  };
});
app.controller('SearchFilterDetailCtrl', function($scope, $stateParams) {
  $scope.pub_id = $stateParams.pub_id;
  $scope.story_title = $stateParams.story_title;
  $scope.story_text = $stateParams.story_text;
});

// Show all stories from ACI, using paging and StoriesService
app.controller('StoriesController', function($scope, $ionicScrollDelegate, StoriesService) {

  $scope.loadMoreStories = function() {
    // Handle StoriesService's getStories() returned promise
    StoriesService.getStories().then(
    function(stories) {
      $ionicScrollDelegate.scrollToRememberedPosition();
      $scope.stories = stories;

      $scope.$broadcast('scroll.infiniteScrollComplete');
      $ionicScrollDelegate.scrollToRememberedPosition();
    },
    function(failedInfo) {
      alert('failedInfo: ' + failedInfo);
    });
  };
});
app.controller('StoryController', function($scope, story) {
  //console.log('StoryController - story: ' + story.title);
  $scope.story = story;
});



// Testing ionic-plugings-keyboard (https://github.com/driftyco/ionic-plugins-keyboard/tree/dev)
// window.addEventListener('native.keyboardhide', keyboardHideHandler);
// window.addEventListener('native.keyboardshow', keyboardShowHandler);
// function keyboardHideHandler(e){alert('JSON.stringify(e): ' + JSON.stringify(e));}
// function keyboardShowHandler(e){alert('JSON.stringify(e): ' + JSON.stringify(e));}

// Stories Search
app.controller('StoriesSearchController', function($scope, $ionicScrollDelegate, $state, StoriesSearchService, $ionicPlatform) {

  console.log('$scope.search: ' + $scope.query);
  console.log('$state.current.data.cachedSearchQuery: ' + $state.current.data.cachedSearchQuery);

  $scope.performSearch = function() {
    // Cache the search query to add it to the search box when coming back from the detail view
    $state.current.data.cachedSearchQuery = $scope.query;

    // Clean stories queues
    $scope.stories = [];
    $state.current.data.cachedStories = [];
    StoriesSearchService.clearStories();

    // Handle StoriesSearchService's searchStories() returned promise
    StoriesSearchService.searchStories($scope.query).then(
    function(stories) {
      // Remember scroll position when coming back from detail view
      $ionicScrollDelegate.scrollToRememberedPosition();

      // Cache stories
      $scope.stories = stories;
      $state.current.data.cachedStories = stories;

      // Can now load more content for the infinite scroll
      $scope.$broadcast('scroll.infiniteScrollComplete');
    },
    function(failedInfo) {
      console.log('failedInfo: ' + failedInfo);
    });
  };

  $scope.searchDidChange = function() {
    // Pending implementation...
    console.log('searchDidChange');
    console.log('$scope.query: ' + $scope.query);
  };

  $scope.loadMoreStories = function() {
    // Pending implementation...
    //console.log('loadMoreStories');
  };

  $scope.clearSearch = function() {
    console.log('clearSearch');
    // Bring list to a clean state
    $scope.query = null;
    $scope.stories = [];
    $state.current.data.cachedStories = [];
    StoriesSearchService.clearStories();
  };

  // Get list to previous state using cached query and stories
  if ($state.current.data.cachedSearchQuery) {
    $scope.query = $state.current.data.cachedSearchQuery;
    $scope.stories = $state.current.data.cachedStories;
  }


  // Helpers
  $scope.platform = function() {
    console.log('$ionicPlatform: ' + $ionicPlatform);
    console.log('$ionicPlatform.type: ' + $ionicPlatform.current);
  };


  $scope.submit = function() {
    window.cordova.plugins.Keyboard.close();
    $scope.performSearch();
  };

});