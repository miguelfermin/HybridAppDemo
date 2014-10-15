//  services.js
//  HybridAppDemo
//
//  Created by Miguel Fermin on 10/15/2014.
//  Copyright (c) 2014 Miguel Fermin. All rights reserved.
//
var app = angular.module('starter.services', []);

app.service('ACISearchService', function($q) {
	
	return {
		stories: [{pub_id: '1',name: 'Pick up apples',done: false},{id: '2',name: 'Mow the lawn',done: true}],

		getStories: function() {
			return this.stories;
		},

		getStory: function(pub_id) {

			var dfd = $q.defer();

			this.stories.forEach(function(story) {
				//if (todo.id === todoId) dfd.resolve(todo);
				dfd.resolve(story);
			});

			return dfd.promise;
		}
	};
});