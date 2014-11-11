//  controllers.js
//  HybridAppDemo
//
//  Created by Miguel Fermin on 10/15/2014.
//  Copyright (c) 2014 Miguel Fermin. All rights reserved.
//
var app = angular.module('starter.controllers', []);

/**
 * Stories Search
 * @param  {[type]} $scope               [description]
 * @param  {[type]} $ionicScrollDelegate [description]
 * @param  {[type]} $state               [description]
 * @param  {[type]} StoriesSearchService [description]
 * @return {[type]}                      [description]
 */
app.controller('StoriesSearchController', function($scope, $ionicScrollDelegate, $state, $ionicNavBarDelegate, StoriesSearchService) {

  // Update view's title
  $ionicNavBarDelegate.setTitle('Stories');

  $scope.isSearchBox = false;

  // Get list to previous state using cached query and stories
  if ($state.current.data.cachedSearchQuery) {
    $scope.query = $state.current.data.cachedSearchQuery;
  }


  $scope.stories = function() {
    // Stories to use in the view
    return $state.current.data.cachedStories;
  };

  $scope.showSearchBox = function() {
    $scope.isSearchBox = true;
    $ionicNavBarDelegate.setTitle('');
  };

  $scope.hideSearchBox = function() {
    $scope.isSearchBox = false;
    $ionicNavBarDelegate.setTitle('Stories');
  };


  $scope.searchStories = function(completionBlock) {
    console.log('searchStories - the service');

    // Handle StoriesSearchService's searchStories() returned promise
    StoriesSearchService.searchStories($scope.query).then(

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

  $scope.performSearch = function() {
    console.log('performSearch');

    // Cache the search query to add it to the search box when coming back from the detail view
    $state.current.data.cachedSearchQuery = $scope.query;

    // Clean stories queues
    $state.current.data.cachedStories = [];
    StoriesSearchService.clearStories();

    //$scope.isSearching = true;
    isSearching = true;
    console.log('performSearch, isSearching = ' + isSearching);
    
    // Search
    $scope.searchStories(function() {

      //isSearching = false;
      console.log('inside performSearch/completionBlock before 6s timer, isSearching = ' + isSearching + '\n ');

      setTimeout(function() {
        console.log('AFTER 6S TIMER....performSearch/ before setting it back to false, isSearching = ' + isSearching);
        isSearching = false;
        console.log('AFTER 6S TIMER....performSearch/ after setting it back to false, isSearching = ' + isSearching);
      }, 6000);
    });
  };

  $scope.loadMoreStories = function() {
    //console.log('loadMoreStories');
    console.log('loadMoreStories, isSearching = ' + isSearching);
    // Use 'StoriesSearchService' to load the stories async, pass a completionBlock to be executed when the service's promise is resolved.
    

    if (isSearching === false) {
      $scope.searchStories(function() {
        StoriesSearchService.incrementPage();
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });

    }
    else {
      //console.log('loadMoreStories, isSearching-X = ' + isSearching);
    }
    
  };


  $scope.searchDidChange = function() {
    // Pending implementation...
    console.log('searchDidChange, $scope.query: ' + $scope.query);
  };

  $scope.clearSearch = function() {
    //console.log('clearSearch................');
    $state.current.data.cachedStories = [];
    StoriesSearchService.clearStories();
  };

  $scope.submit = function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      //console.log('submit tapped...if');
      window.cordova.plugins.Keyboard.close();
      $scope.performSearch();
    }
    else {
      //console.log('submit tapped...else');
      $scope.performSearch();
    }
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
    // Determines whether or not the infinite scroll should load more content.
    
    //console.log('\n ' + 'moreDataCanBeLoaded' + '\n ');

    if ($state.current.data.cachedStories.length > 0) {
      return true;
    }
    else {
      return false;
    }
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
