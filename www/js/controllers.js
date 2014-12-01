//  controllers.js
//  HybridAppDemo
//
//  Created by Miguel Fermin on 10/15/2014.
//  Copyright (c) 2014 Miguel Fermin. All rights reserved.
//
var app = angular.module('starter.controllers', []);

app.controller('MainController', function($scope) {
  console.log('MainController...');

  /*
  // HockeyApp keys / secrets
  var iosKey = '94fe25f0d9f9740dbff76acb421af800';
  var iosSecret = '16e50753a4128b6697f941c069ecd88f';
  var androidKey = 'd8819dffa508288a78b13c3a6047f4d8';
  var androidSecret = '5157c09f7a17d2db5f5348b147eb44c9';

  // Initialize HockeyApp SDK
  window.cordova.plugins.hockeyapp.start(
    function() {
      // body...
      console.log('cordova.plugins.hockeyapp.start...success failure callback');
    },
    function() {
      // body...
      console.log('cordova.plugins.hockeyapp.start...failure callback');
    },
    iosKey);

  // Display tester feedback UI
  window.cordova.plugins.hockeyapp.feedback(
    function() {
      // body...
      console.log('cordova.plugins.hockeyapp.start...success callback');
    },
    function() {
      // body...
      console.log('cordova.plugins.hockeyapp.start...failure callback');
    });
  */
 
  // var hockeyapp = {
  //   start:function(success, failure, token) {
  //     exec(success, failure, "HockeyApp", "start", [ token ]);
  //   },
  //   feedback:function(success, failure) {
  //     exec(success, failure, "HockeyApp", "feedback", []);
  //   }
  // };
});

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
    return true;
    // if ($scope.stories().length > 0) {
    //   return true;
    // } else {
    //   return false;
    // }
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
  $scope.showShareSheet = function() {
    window.plugins.socialsharing.share(story.title, null, null, story.url);
  };

  console.log('window.plugins.hockeyapp: ',window.plugins.hockeyapp);
  console.log('window.plugins.socialsharing: ',window.plugins.socialsharing);

  // HockeyApp keys / secrets
  var iosKey = '94fe25f0d9f9740dbff76acb421af800';
  var iosSecret = '16e50753a4128b6697f941c069ecd88f';
  var androidKey = 'd8819dffa508288a78b13c3a6047f4d8';
  var androidSecret = '5157c09f7a17d2db5f5348b147eb44c9';
  
  // Initialize HockeyApp SDK
  // window.plugins.hockeyapp.start(
  //   function() {console.log('cordova.plugins.hockeyapp.start...success failure callback');},
  //   function() {console.log('cordova.plugins.hockeyapp.start...failure callback');},
  //   iosKey);
  
  // Display tester feedback UI
  // window.plugins.hockeyapp.feedback(
  //   function() {console.log('cordova.plugins.hockeyapp.start...success callback');},
  //   function() {console.log('cordova.plugins.hockeyapp.start...failure callback');});
});

