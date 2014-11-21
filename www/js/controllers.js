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

  // Get list to previous state using cached query and stories
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

  var isSearching = false;

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
    if ($scope.stories().length > 0) { // StoriesSearchService.getStories(); $state.current.data.cachedStories
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
  // Use jQuery to get DOM elements that need to be managed in this controller.
  var $h1 = $('ion-view ion-nav-bar h1');
  var $input = $('ion-view ion-nav-bar input');

  // Keep this info in $state so it's persisted between views transitions and different instances of this controller
  $scope.isSearchBarShown = function() {
    return $state.current.data.isSearchBarShown;
  };

  $scope.showActiveSearchBar = function() {
    StoriesSearchService.$e = $h1;
    $h1.hide();
    $state.current.data.isSearchBarShown = true;
    $timeout(function() {
      $input.focus();
    });
  };

  $scope.hideSearchBox = function() {
    $h1.show();
    $state.current.data.isSearchBarShown = false;
    $rootScope.$broadcast('activeSearchBarWasHidden');
  };

  // Passive Search bar was tapped event
  $scope.$on('showActiveSearchBarInvoked', function(event, query) {
    $scope.showActiveSearchBar();
  });

  // Delegate search querie
  $scope.searchDidChange = function() {
    $rootScope.$broadcast('searchQueryChanged', $scope.query);
  };

  $scope.submit = function() {
    // Tell the controller when the user submits the form (tap the search button)
    $rootScope.$broadcast('searchSubmitted', $scope.query);
    $input.blur(); // Hide keyboard
  };
});

app.controller('PassiveSearchBarController', function($scope, $state, $rootScope) {
  $scope.shouldShowPassiveSearchBar = function () {
    return $state.current.data.shouldShowPassiveSearchBar;
  };

  $scope.showActiveSearchBar = function() {
    $rootScope.$broadcast('showActiveSearchBarInvoked');
    $state.current.data.shouldShowPassiveSearchBar = false;
  };

  $scope.$on('activeSearchBarWasHidden', function(event, query) {
    $state.current.data.shouldShowPassiveSearchBar = true;
  });
});

app.controller('StoryController', function($scope, story, $timeout) {
  $scope.story = story;

  var $element = $('ion-view ion-nav-bar h1');
  console.log('$element: ',$element, '\n ');

  $timeout(function() {
    $element.hide();
  });

});


/* NOTE: Please ignore the controllers below. They are not being used for now. */
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
// Experimental code
// console.log('$location.path() ' + $location.path());
// $location.search( { q: $scope.query } );
// $scope.$on('$locationChangeSuccess', function() {
//   console.log('locationChangeSuccess');
//   updateSearchFromURL();
// });