//  controllers.js
//  HybridAppDemo
//
//  Created by Miguel Fermin on 10/15/2014.
//  Copyright (c) 2014 Miguel Fermin. All rights reserved.
//
var app = angular.module('starter.controllers', []);

app.controller('AppCtrl', function($scope) {
});

// ACI Search Controller
app.controller('SearchCtrl', function($scope, $http) {
  // Networking
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
          //$scope.$broadcast('scroll.infiniteScrollComplete');
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
  $scope.pub_id = $stateParams.pub_id;
  $scope.story_title = $stateParams.story_title;
  $scope.story_text = $stateParams.story_text;
});



app.controller('StoriesController', function($scope, StoriesService) {
  // var stories = [
  // {number: 0, title: "Cars",   pub_id: "0000", pub_name: "Cars Publication" },
  // {number: 1, title: "Boats",  pub_id: "0001", pub_name: "Boats Publication" },
  // {number: 2, title: "Planes", pub_id: "0002", pub_name: "Planes Publication" },
  // {number: 3, title: "Horses", pub_id: "0003", pub_name: "Horses Publication" },
  // {number: 4, title: "Ships",  pub_id: "0004", pub_name: "Ships Publication" },
  // {number: 5, title: "Shoes",  pub_id: "0005", pub_name: "Shoes Publication" }
  // ];
  // for (var i = 0; i < 10000; i++) {
  //   stories.push({number: i, title: "Shoes",  pub_id: "000"+i, pub_name: "Random Publication" });
  // }
  // $scope.stories = stories;

  // Handle promise
  var promise = StoriesService.getStories();
  promise.then(
    function(stories) {
      $scope.stories = stories;
    },
    function(failedInfo) {
      alert('failedInfo: ' + failedInfo);
    });


  /*
  $scope.loadMore = function() {
    promise.then(
      function(stories) {
        $scope.stories = stories;
        //$scope.$broadcast('scroll.infiniteScrollComplete');
      },
      function(failedInfo) {
        alert('failedInfo: ' + failedInfo);
      });
  };
  */

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    /*alert('something changed...');
    console.log(event);
    console.log(toState);
    console.log(toParams);
    console.log(fromState);
    console.log(fromParams);
    event.preventDefault(); */
  });
});

app.controller('StoryController', function($scope, story) {
  console.log('story: ' + story.title);
  $scope.story = story;
});

