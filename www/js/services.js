//  services.js
//  HybridAppDemo
//
//  Created by Miguel Fermin on 10/15/2014.
//  Copyright (c) 2014 Miguel Fermin. All rights reserved.
//
var app = angular.module('starter.services', []);

app.factory('StoriesSearchService', function($http, $q) {
	var stories = [];
	var cachedStories = []; // Note: still thinking of alternatives for this cache...
	var page = 0;
	var storyCounter = 0;

	function createStoriesWithData (data) {
		if (data && data.hits && data.hits.length > 0) {
			// The passed data object has the information to create the story object
			data.hits.forEach(function(hit) {

				// Only add stories that have text
				if (hit._highlightResult.text)  {

					// Flag duplicates if any
					stories.forEach(function(story) {
						//console.log('story.id: ',story.id);
						//console.log('hit.$id: ',hit.$id,'\n ');
						if (story.id === hit.$id) {
							alert('DUPLICATE STORY WITH ID: ',story.id, 'and: ', hit.$id);
						}
					});

					// Create literal story object and add to stories array
					var story = {
						id: hit.$id,
						title: hit.title,
						text: hit._highlightResult.text.value,
						date: hit.date,
						pub_id: hit.pub.$id,
						pub_name: hit.pub.name,
						authors: hit.authors,
						number: storyCounter += 1
					};
					stories.push(story);
					cachedStories.push(story);
				}
			});
			//console.log('number of stories loaded: ',stories.length);
			//console.log('number of stories cached: ',cachedStories.length);
		}
	}
	return {
		clearStories: function () {
			stories = [];
		},
		clearCachedStories: function () {
			cachedStories = [];
		},
		resetPages: function () {
			page = 0;
		},
		clearAll: function () {
			page = 0;
			stories = [];
			cachedStories = [];
			storyCounter = 0;
		},
		incrementPage: function() {
			page += 1;
		},
		currentPage: function() {
			return page;
		},
		getStory: function(index) {
			return cachedStories[index];
		},
		searchStories: function(query) {
			console.log('page number: ',page);
			var deferred = $q.defer();
			var params = {
				q: query,
				page: page
			};

			$http({ method: 'GET', url: 'http://dev.acindex.com/search', params: params })

				.success(function(data) {
					// Use data object to create stories and resolve promise
					createStoriesWithData(data);
					deferred.resolve(stories);
				})

				.error(function(msg, code) {
					deferred.reject('Error message: ' + msg + ', code: ' + code);
				});
			return deferred.promise;
		}
	};
});

/* NOTE: Please ignore the services below. They are not being used for now. */
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
