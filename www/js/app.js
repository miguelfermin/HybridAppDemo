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
      templateUrl: "templates/menu.html"
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
      cachedStories: []
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



  /* NOTE: Please ignore the states below. They are not being used for now. */
  
  // Show all stories from ACI, using paging and StoriesService
  $stateProvider.state('app.stories', {
    abstract: true,
    url: '/stories',
    views: {
      'menuContent': {
        template: '<ion-nav-view></ion-nav-view>'
      }
    }
  });
  $stateProvider.state('app.stories.index', {
    url: '',
    templateUrl:'templates/stories.html',
    controller: 'StoriesController',
    // Keep data on state to try to avoid the master list to reload when coming back from detail view.
    // data: {
    //   stories:[]
    // }
  });
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
  // Search Filter method, without using a service, all work done in the controller. Kept for reference only
  $stateProvider.state('app.search', {
    url: "/search",
    views: {
      'menuContent' :{
        templateUrl: "templates/search-filter.html",
        controller: 'SearchFilterCtrl'
      }
    }
  });
  $stateProvider.state('app.searchDetail', {
    url: "/search/:pub_id?story_title&story_text&authors",
    views: {
      'menuContent' :{
        templateUrl: "templates/story.html",
        controller: 'SearchFilterDetailCtrl'
      }
    }
  });
});
