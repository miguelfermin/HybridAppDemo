//  services.js
//  HybridAppDemo
//
//  Created by Miguel Fermin on 10/15/2014.
//  Copyright (c) 2014 Miguel Fermin. All rights reserved.
//
var app = angular.module('starter.services', []);

app.factory('StoriesServiceStatic', function() {
	var stories = [
	{number: 0, title: "Cars",   pub_id: "0000", pub_name: "Cars Publication" },
	{number: 1, title: "Boats",  pub_id: "0001", pub_name: "Boats Publication" },
	{number: 2, title: "Planes", pub_id: "0002", pub_name: "Planes Publication" },
	{number: 3, title: "Horses", pub_id: "0003", pub_name: "Horses Publication" },
	{number: 4, title: "Ships",  pub_id: "0004", pub_name: "Ships Publication" },
	{number: 5, title: "Shoes",  pub_id: "0005", pub_name: "Shoes Publication" }
    ];
    return {
    stories: stories,
    getStory: function(index) {
    return stories[index];
    }
	};
});

app.factory('StoriesService', function($http, $q) {
	var stories = [];
	var storyCounter = 0;
	return {
		getStory: function(index) {
			//alert('getStory() called...');
			console.log('index: ' + index);
			return stories[index];
		},
		getStories: function() {
			//alert('getStories() called...');
			var deferred = $q.defer();

			$http({ method: 'GET', url: 'http://dev.acindex.com/search', params: {page: '1'} })

			.success(function(data) {
				data.hits.forEach(function(hit) {
					storyCounter += 1;
					var story = {
						number: storyCounter,
						title: hit.title,
						date: hit.date,
						pub_id: hit.pub.$id,
						pub_name: hit.pub.name,
						authors: hit.authors
					};
					stories.push(story);
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





