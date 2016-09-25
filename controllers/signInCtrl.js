	app.controller('SignInCtrl',['config','$scope','$http','$rootScope','$location','CurrentOb','YamlParse', 'Notification','SignIn','$mdSidenav', 
		function(config,$scope, $http,$rootScope,$location, CurrentOb,YamlParse, Notification, SignIn,$mdSidenav){
		var vm = this;
		vm.formType = {};
		vm.formObj = {};
		// vm.objUrl = 'http://localhost:8080/RESTMarksFull/api/account';
		vm.objUrl = config.signInUrl;
		vm.signup = false;
		$scope.serviceName = config.serviceName;

		vm.showSingUpForm = function(){
			console.log("new user")
			vm.signup = true;
		}

		vm.signIn = function(username, password){
			vm.credentials = btoa(username + ':' + password);

			console.log(vm.credentials)
			// console.log (CurrentOb.currentObject)
			// vm.currentObject = CurrentOb.test();
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
				// vm.objinit();
				// vm.objs = response.data;
				// $scope.ob = response.data.linklist;
				// vm.properties = Object.getOwnPropertyNames(response.data);
				// vm.passArguments ();
				console.log('signedIn!');
				$rootScope.signedIn = true;
				// if ($rootScope.currentObject.linkURI === config.apiUrl ){
				// console.log($rootScope.currentObject.linkURI);
				// // vm.setCurrentObj(obj);
				// $location.path( "/" );
				// }
				// else {
				// 	// vm.setCurrentObj($rootScope.currentObject);
				// 	CurrentOb.set($rootScope.previusObj);
				// 	$location.path( "/view" );
				// }
				vm.clearCurrent();
				$location.path( "/" );
			}).catch(function(error){
				console.log(error)
				Notification.error("Wrong credentials ");
			});
		};

		vm.signOut = function(){
			$rootScope.credentials = "";
			$rootScope.signedIn = false;
			SignIn.headers = {};
		};

		// vm.objinit= function(){
		// 			// vm.table = vm.getschema();
		// 			YamlParse.getschema().then(function(response){
		// 				vm.table = response;
		// 			var x = [];
		// 			// vm.table=YamlParse.calc();
		// 			var y = vm.table;
		// 			// console.log(y.length)
		// 			for(i=0; i<y.length; i++){
		// 			vm.initObject = vm.table[i];
		// 			x[i] = JSON.parse(vm.initObject);
		// 			// console.log(x);
		// 			}
		// 			console.log(x)
		// 			vm.find(x);
		// 		});
		// 			// console.log(vm.table)
					
					
		// 		};

		vm.parsedTable=YamlParse.parsejson();

		// =========== na metafero tin objinit() pano sto Yamlparser giati xreiazomai na kaleitai
		// mono i find() kai na tin antikatastiso me kathe klisi stis objinit pio kato ==========

		vm.find = function(){
			for (i = 0 ; i<vm.parsedTable.length; i++){
				var y = vm.parsedTable[i].Name;
				console.log(vm.parsedTable.length)
				var k =new RegExp( y +'\/\\d{1,4}$');
				// console.log("RegExp " + k.test(vm.objUrl))
				if (k.test(vm.objUrl) || vm.objUrl.endsWith(y) ){
					vm.name = y;
					console.log(vm.name)
					console.log("vm.name")
					vm.formObj = {};
					for(j=0; j<vm.parsedTable[i].Properties.length; j++){
						var key = vm.parsedTable[i].Properties[j].Name;
						var type = vm.parsedTable[i].Properties[j].Type;
						vm.formObj[key] = "" ;
						vm.formType[key] = type;
					}
					// console.log(vm.formType)
				}
			}
		};

		vm.signUp = function(){
			$http({
				method : 'POST',
				url : vm.objUrl,
				// headers: {
				// 	'Content-Type': 'application/json'},
				data : vm.formObj
			})
			.then(function(response){
				Notification("Registration succesful. Welcome " + vm.formObj.username);
				// vm.objinit();
				// vm.objs = response.data;
				// $scope.ob = response.data.linklist;
				// vm.properties = Object.getOwnPropertyNames(response.data);
				// vm.passArguments ();
				// console.log('signedIn!');
				// $rootScope.signedIn = true;
				$location.path( "/signin" );
			}).catch(function(error){
				console.log(error)
				Notification("Try again ");
			});
		};
		

		vm.clearCurrent = function(){
			$rootScope.currentObject = {};
			$scope.$broadcast('GoHome');
			$location.path("/")
			// $http.get(config.apiUrl,SignIn.headers)
			// .then(function(response){
			// 	console.log(response.data)
			// 	CurrentOb.set(response.data);
			// 	$location.path("/")
			// })
		}

		vm.openSidebar = function(){
			$mdSidenav('left').open();
		};
		vm.closeSidebar = function(){
			$mdSidenav('left').close();
		};

		// vm.setCurrentObj= function(obj){
		// 	$rootScope.currentObject = obj;
		// 	console.log("------")
		// 	// console.log(currentObject)
		// 	// var check = Object.getOwnPropertyNames(vm.currentObj);
		// 	// console.log(check);
		// 	// console.log(obj);
		// 	vm.objUrl = $rootScope.currentObject.linkURI;
		// 	console.log(obj.linkVerb);
		// 	vm.setAction (obj.linkVerb);
		// 	// vm.setFormObj(vm.objUrl );
		// 	vm.objinit();
		// 	vm.getObj();
		// };
		vm.ckeckLocation= function(){
			if ($location.path() == "/signin" ){
				return false;
			}
			else if ($location.path() == "/edit"){
				return false;
			}
			return true;

		};

		console.log($location.path())
		vm.find();

	}]);