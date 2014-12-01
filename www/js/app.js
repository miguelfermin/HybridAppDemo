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
  // Fallback state
  $urlRouterProvider.otherwise('/app/stories-search');

  // Menu (main) state
  $stateProvider.state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'MainController'
  });

  // Stories Search
  $stateProvider.state('app.stories-search', {
    abstract: true,
    url: '/stories-search',
    views: {
      'menuContent': {
        template: '<ion-nav-view></ion-nav-view>'
      }
    }
  });

  $stateProvider.state('app.stories-search.index', {
    url: '',
    templateUrl:'templates/stories-search.html',
    controller: 'StoriesSearchController',
    data: {
      cachedSearchQuery: null,
      cachedStories: [],
      isSearchBarShown: false,
      shouldShowPassiveSearchBar: true
    }
  });

  $stateProvider.state('app.stories-search.detail', {
    url: '/:story',
    templateUrl:'templates/story.html',
    controller: 'StoryController',
    resolve: {
      story: function($stateParams, StoriesSearchService) {
        return StoriesSearchService.getStory($stateParams.story);
      }
    }
  });
});