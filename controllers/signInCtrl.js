	app.controller('SignInCtrl',['config','$scope','$http','$rootScope','$location','CurrentOb','YamlParse', 'Notification','SignIn','$mdSidenav', 
		function(config,$scope, $http,$rootScope,$location, CurrentOb,YamlParse, Notification, SignIn,$mdSidenav){
		var vm = this;
		vm.formType = {};
		vm.formObj = {};
		vm.objUrl = config.signInUrl;
		vm.signup = false;
		$scope.serviceName = config.serviceName;

		vm.showSingUpForm = function(){
			vm.signup = true;
		};

		vm.signIn = function(username, password){
			vm.credentials = btoa(username + ':' + password);

			$http({
				method : 'get',
				url : vm.objUrl,
				headers: {
					'Authorization': 'Basic ' + vm.credentials,
					'Content-Type': 'application/json'}
			})
			.then(function(response){
				$rootScope.credentials = vm.credentials;
				SignIn.credentials = vm.credentials;
				SignIn.createHeader();
				Notification.success("Login successful. Welcome " + username);
				console.log('signedIn!');
				$rootScope.signedIn = true;
				vm.clearCurrent();
				$location.path( "/" );
			}).catch(function(error){
				console.log(error);
				Notification.error("Wrong credentials ");
			});
		};

		vm.signOut = function(){
			$rootScope.credentials = "";
			$rootScope.signedIn = false;
			SignIn.headers = {};
		};


		vm.parsedTable=YamlParse.parsejson();

		vm.find = function(){
			for (i = 0 ; i<vm.parsedTable.length; i++){
				var y = vm.parsedTable[i].Name;
				var k =new RegExp( y +'\/\\d{1,4}$');
				if (k.test(vm.objUrl) || vm.objUrl.endsWith(y) ){
					vm.name = y;
					vm.formObj = {};
					for(j=0; j<vm.parsedTable[i].Properties.length; j++){
						var key = vm.parsedTable[i].Properties[j].Name;
						var type = vm.parsedTable[i].Properties[j].Type;
						vm.formObj[key] = "" ;
						vm.formType[key] = type;
					}
				}
			}
		};

		vm.signUp = function(){
			$http({
				method : 'POST',
				url : vm.objUrl,
				data : vm.formObj
			})
			.then(function(response){
				Notification("Registration succesful. Welcome " + vm.formObj.username);
				$location.path( "/signin" );
			}).catch(function(error){
				console.log(error)
				Notification("Try again ");
			});
		};
		

		vm.clearCurrent = function(){
			$rootScope.currentObject = {};
			$scope.$broadcast('GoHome');
			$location.path("/");
		};

		vm.openSidebar = function(){
			$mdSidenav('left').open();
		};
		vm.closeSidebar = function(){
			$mdSidenav('left').close();
		};

		vm.ckeckLocation= function(){
			if ($location.path() == "/signin" ){
				return false;
			}
			else if ($location.path() == "/edit"){
				return false;
			}
			return true;

		};

		vm.find();

	}]);