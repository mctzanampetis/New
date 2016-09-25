
	var app = angular.module('myApp',	['ngMaterial','ngRoute', 'ui-notification','ngSanitize']);

    app.config(function($routeProvider){
		$routeProvider
		.when('/', {
			templateUrl:'templates/main.html'})
		.when('/view/:obj/:objId', {
			templateUrl:'templates/view.html'})
		.when('/view', {
			templateUrl:'templates/view.html'})
		.when('/edit', {
			templateUrl:'templates/edit.html'})
		.when('/signin', {
			templateUrl:'templates/signin.html'
			// controller: 'SignInCtrl',
			// controllerAlias: 'vm'
		})
		.otherwise({redirectTo:'/'});
	})

	.config(function(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 2000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'center',
            positionY: 'top'
        });
    });


	




	
