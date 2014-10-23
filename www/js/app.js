// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    });

  // Nested level of our state machine namespaced to app.stories
  $stateProvider.state('app.stories', {
    abstract: true,
    url: '/stories',
    views: {
      'menuContent': {
        template: '<ion-nav-view></ion-nav-view>'
      }
    }
  });

  // Master
  $stateProvider.state('app.stories.index', {
    url: '',
    templateUrl:'templates/stories.html',
    controller: 'StoriesController'
  });

  // Detail
  $stateProvider.state('app.stories.detail', {
    url: '/:story',
    templateUrl:'templates/story.html',
    controller: 'StoryController',
    resolve: {
      story: function($stateParams, StoriesService) {
        return StoriesService.getStory($stateParams.story);
      }
    }
  });


  $stateProvider.state('app.search', {
    url: "/search",
    views: {
      'menuContent' :{
        templateUrl: "templates/search.html",
        controller: 'SearchCtrl',
        resolve: {
          $stories: function(ACISearchService) {
            return ACISearchService.getStories();
          }
        }
      }
    }
  });
  $stateProvider.state('app.searchDetail', {
    url: "/search/:pub_id?story_title&story_text&authors",
    views: {
      'menuContent' :{
        templateUrl: "templates/search-detail.html",
        controller: 'SearchDetailCtrl',

        // ACISearchService Service test
        resolve: {
          $story: function($stateParams, ACISearchService) {
            return ACISearchService.getStory($stateParams.pub_id);
          }
        }
        // Service test
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/search');
});

