//  controllers.js
//  HybridAppDemo
//
//  Created by Miguel Fermin on 10/15/2014.
//  Copyright (c) 2014 Miguel Fermin. All rights reserved.
//
var app = angular.module('starter.controllers', []);

app.controller('StoriesSearchController', function($scope, $ionicScrollDelegate, $state, StoriesSearchService, $interval) {
  // Good debugging techinque to check if more then one controller is being used.
  //var controllerID = Math.random();

  var isSearching = false;

  // Get list to previous state using cached query
  if ($state.current.data.cachedSearchQuery) {
    $scope.query = $state.current.data.cachedSearchQuery;
  }

  $scope.stories = function() {
    // Stories to use in the view
    return StoriesSearchService.getStories();
  };

  $scope.searchStories = function(completionBlock) {
    // Handle StoriesSearchService's searchStories() returned promise
    StoriesSearchService.searchStories($scope.query).then(
      // Promise successful
      function(stories) {
        StoriesSearchService.clearStories();
        // The 'loadMoreStories' function would pass a function to call when the promise is resolved
        if (completionBlock) {
          completionBlock();
        }
        StoriesSearchService.incrementPage();
      },
      // Promise failed, handle error
      function(failedInfo) {
        console.log('failedInfo: ' + failedInfo);
      });
  };

  $scope.performSearch = function() {
    // Cache the search query to add it to the search box when coming back from the detail view
    $state.current.data.cachedSearchQuery = $scope.query;

    // Clean stories queues
    StoriesSearchService.clearAll();

    // This will prevent the infiniteScroll from loading more stories while searching.
    isSearching = true;

    $scope.searchStories(function() {
      // The moreDataCanBeLoaded() function is called multiple times during this operation, 
      // so we need to delay setting the "isSearching" flag to false, otherwise it would be ineffective.
      $interval(function() {
        isSearching = false;
        // This is important, we need to broadcast that we're done here in order to trigger
        // another call to moreDataCanBeLoaded() and keep the infinite scroll going
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, 2000,1);
    });
  };

  $scope.loadMoreStories = function() {
    if (isSearching === false) {
      $scope.searchStories(function() {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }
  };

  $scope.moreDataCanBeLoaded = function() {
    if ($scope.stories().length > 0) {
      return true;
    } else {
      return false;
    }
  };

  // Listen to events from search bar
  $scope.$on('searchSubmitted', function(event, query) {
    $scope.query = query;
    $scope.performSearch();
  });
});

app.controller('ActiveSearchBarController', function($scope, $location, $rootScope, $state, $timeout, $ionicNavBarDelegate, StoriesSearchService) {
  // Keep this info in $state so it's persisted between views transitions and different instances of this controller
  $scope.isSearchBarShown = function() {
    return $state.current.data.isSearchBarShown;
  };

  $scope.showActiveSearchBar = function() {
    $state.current.data.isSearchBarShown = true;
    $timeout(function() {
      $('ion-view ion-nav-bar input').focus();
      $('ion-view ion-nav-bar h1').hide();
    });
  };

  $scope.hideSearchBox = function() {
    $state.current.data.isSearchBarShown = false;
    $rootScope.$broadcast('activeSearchBarWasHidden');
    $timeout(function() {
      $('ion-view ion-nav-bar h1').show();
      $ionicNavBarDelegate.align('center');
    },500);
  };

  // Passive Search bar was tapped event
  $scope.$on('showActiveSearchBarInvoked', function(event, query) {
    $scope.showActiveSearchBar();
  });

  // Delegate search query to StoriesSearchController
  $scope.searchDidChange = function() {
    $rootScope.$broadcast('searchQueryChanged', $scope.query);
  };

  $scope.submit = function() {
    $rootScope.$broadcast('searchSubmitted', $scope.query);
    $('ion-view ion-nav-bar input').blur(); // Hide keyboard
  };

  // Hide title if is shown when returning from detail view and the active search bar is presented
  if ($scope.isSearchBarShown() === true) {
    $timeout(function() {
      $('ion-view ion-nav-bar h1').hide();
    },300); // Without this 300ms delay, it doesn't work.
  }
});

app.controller('StoryController', function($scope, story, $timeout, $ionicNavBarDelegate) {
  $scope.story = story;
});

// app.controller('PassiveSearchBarController', function($scope, $state, $rootScope) {
//   $scope.shouldShowPassiveSearchBar = function () {
//     return $state.current.data.shouldShowPassiveSearchBar;
//   };
//   $scope.showActiveSearchBar = function() {
//     $rootScope.$broadcast('showActiveSearchBarInvoked');
//     $state.current.data.shouldShowPassiveSearchBar = false;
//   };
//   $scope.$on('activeSearchBarWasHidden', function(event, query) {
//     $state.current.data.shouldShowPassiveSearchBar = true;
//   });
// });