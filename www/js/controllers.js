//  controllers.js
//  HybridAppDemo
//
//  Created by Miguel Fermin on 10/15/2014.
//  Copyright (c) 2014 Miguel Fermin. All rights reserved.
//
var app = angular.module('starter.controllers', []);

// Experimental code
// console.log('$location.path() ' + $location.path());
// $location.search( { q: $scope.query } );
// $scope.$on('$locationChangeSuccess', function() {
//   console.log('locationChangeSuccess');
//   updateSearchFromURL();
// });

app.controller('StoriesSearchController', function($scope, $ionicScrollDelegate, $state, StoriesSearchService) {

  // Good debugging techinque to check if more then one controller is being used.
  var controllerID = Math.random();

  // Get list to previous state using cached query and stories
  if ($state.current.data.cachedSearchQuery) {
    $scope.query = $state.current.data.cachedSearchQuery;
  }

  $scope.stories = function() {
    // Stories to use in the view
    return $state.current.data.cachedStories;
  };

  $scope.searchStories = function(query, completionBlock) {
    
    console.log('searchStories - the service', controllerID);
    console.log('searchStories - query', query);

    // Handle StoriesSearchService's searchStories() returned promise
    StoriesSearchService.searchStories(query).then(

      // Promise successful
      function(stories) {
        console.log('Promise successful' + '\n ');

        // Remember scroll position when coming back from detail view
        $ionicScrollDelegate.scrollToRememberedPosition();

        // Cache stories
        $state.current.data.cachedStories = stories;

        // Notify observers we're done loading content
        //$scope.$broadcast('scroll.refreshComplete'); /* Disabled for now until I fix the unwanted infinite scrolling issue. */

        // The 'loadMoreStories' function would pass a function to call when the promise is resolved
        if (completionBlock) {
          completionBlock();
        }
      },

      // Promise failed, handle error
      function(failedInfo) {
        console.log('failedInfo: ' + failedInfo);
      });
  };

  var isSearching = false;

  $scope.performSearch = function(query) {
    console.log('performSearch');

    // Cache the search query to add it to the search box when coming back from the detail view
    $state.current.data.cachedSearchQuery = $scope.query;

    // Clean stories queues
    $state.current.data.cachedStories = [];
    StoriesSearchService.clearStories();

    // Search
    isSearching = true;

    $scope.searchStories(query, function() {
      setTimeout(function() {
        isSearching = false;
      }, 1000);
    });
  };

  $scope.loadMoreStories = function() {
    console.log('loadMoreStories',isSearching);

    if (isSearching === false) {
      $scope.searchStories(function() {
        StoriesSearchService.incrementPage();
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }

    // $scope.searchStories(function(query) {
    //   StoriesSearchService.incrementPage();
    //   $scope.$broadcast('scroll.infiniteScrollComplete');
    // });
  };

  $scope.isBrowser = function() {
    // Tells if the app is running in a browser (and not a mobile device). It relies in fact that 'window.cordova.plugins' is undefined 
    // when running the app in a broswer. A more sophisticated method is needed for a production app.
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Mobile Device
      //  NOTE: Need to figure out how to use $cordovaDevice 
      //        (https://github.com/apache/cordova-plugin-device/blob/master/doc/index.md)
      // var device = window.cordova.plugins.Device.getDevice();
      // var cordova = window.cordova.plugins.Device.getCordova();
      // var model = window.cordova.plugins.Device.getModel();
      // var platform = window.cordova.plugins.Device.getPlatform(); // This needs more testing
      // var uuid = window.cordova.plugins.Device.getUUID();
      // var version = window.cordova.plugins.Device.getVersion();
      return false;
    }
    else {
      // Browser
      return true;
    }
  };

  $scope.moreDataCanBeLoaded = function() {
    console.log('moreDataCanBeLoaded');
    if ($state.current.data.cachedStories.length > 0) {
      return true;
    }
    else {
      return false;
    }
  };

  // Listen to events from search bar
  $scope.$on('searchSubmitted', function(event, query) {
    console.log('searchSubmitted, query: ',query);
    $scope.performSearch(query);
  });

  $scope.$on('searchQueryChanged', function(event, query) {
    console.log('searchQueryChanged, query: ',query);
  });

});

app.controller('SearchBarController', function($scope, $state, $ionicNavBarDelegate, StoriesSearchService, $location, $rootScope) {

  // Update view's title
  $ionicNavBarDelegate.setTitle('Stories');

  // Determine whether the search bar is visible or hidden
  $scope.isSearchBox = false;

  $scope.showSearchBox = function() {
    $scope.isSearchBox = true;
    $ionicNavBarDelegate.setTitle('');
  };

  $scope.hideSearchBox = function() {
    $scope.isSearchBox = false;
    $ionicNavBarDelegate.setTitle('Stories');
  };

  // Delegate search querie
  $scope.searchDidChange = function() {
    // Tell the controller that the query changed
    $rootScope.$broadcast('searchQueryChanged', $scope.query);
  };

  $scope.submit = function() {
    // Tell the controller when the user submits the form (tap the search button)
    $rootScope.$broadcast('searchSubmitted', $scope.query);

    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide keyboard on mobile devices
      window.cordova.plugins.Keyboard.close();
    }
  };

  $scope.clearSearch = function() {
    //console.log('clearSearch................');
    //$state.current.data.cachedStories = [];
    //StoriesSearchService.clearStories();
  };

});

// The Story controller. This controller is shared by StoriesController and StoriesSearchController.
app.controller('StoryController', function($scope, story) {
  $scope.story = story;
});



/* NOTE: Please ignore the controllers below. They are not being used for now. */

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
