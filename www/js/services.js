//  services.js
//  HybridAppDemo
//
//  Created by Miguel Fermin on 10/15/2014.
//  Copyright (c) 2014 Miguel Fermin. All rights reserved.
//
var app = angular.module('starter.services', []);

// Stories Service
app.factory('StoriesService', function($http, $q) {
	// $state.current.data.stories - was used for testing
	var stories = [];
	var pageCounter = 0;
	var storyCounter = 0;

	return {
		getStory: function(index) {
			return stories[index];
		},
		getStories: function() {
			pageCounter += 1;
			
			var deferred = $q.defer();
			
			var params = {
				page: pageCounter.toString()
			};

			$http({ method: 'GET', url: 'http://dev.acindex.com/search', params: params })

				.success(function(data) {

					data.hits.forEach(function(hit) {
						storyCounter += 1;
						stories.push({
							number: storyCounter,
							title: hit.title,
							date: hit.date,
							pub_id: hit.pub.$id,
							pub_name: hit.pub.name,
							authors: hit.authors
						});
					});
					deferred.resolve(stories);
				})

				.error(function(msg, code) {
					deferred.reject('Error message: ' + msg + ', code: ' + code);
				});

			return deferred.promise;
		}
	};
});


// Story Search Service
app.factory('StoriesSearchService', function($http, $q) {
	var stories = [];
	var pageCounter = 0;
	var storyCounter = 0;

	return {
		clearStories: function () {
			stories = [];
		},
		getStory: function(index) {
			return stories[index];
		},
		searchStories: function(searchQuery) {
			pageCounter += 1;
			
			var deferred = $q.defer();
			
			var params = {
				q: searchQuery
				//page: pageCounter.toString()
			};

			$http({ method: 'GET', url: 'http://dev.acindex.com/search', params: params })

				.success(function(data) {

					data.hits.forEach(function(hit) {
						storyCounter += 1;
						stories.push({
							number: storyCounter,
							title: hit.title,
							date: hit.date,
							pub_id: hit.pub.$id,
							pub_name: hit.pub.name,
							authors: hit.authors
						});
					});
					deferred.resolve(stories);
				})
				
				.error(function(msg, code) {
					deferred.reject('Error message: ' + msg + ', code: ' + code);
				});

			return deferred.promise;
		}
	};
});








