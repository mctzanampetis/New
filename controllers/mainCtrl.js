app.controller('mainCtrl',['config','$http','$q','$scope','$rootScope','$location', 'YamlParse', 'CurrentOb', 'Notification','SignIn','$mdSidenav',
	 function(config, $http,$q,$scope,$rootScope,$location, YamlParse, CurrentOb, Notification, SignIn,$mdSidenav){
		
		var vm = this;
		
		// vm.baseUrl = 'http://109.231.121.89:8080/reviews/api/product'
		// vm.baseUrl = 'http://localhost:8080/RESTMarksFull/api/account'

		// vm.objUrl = 'http://155.207.19.237:8080/RESTMarksFull/api/account/';
		// vm.objUrl = 'http://localhost:8080/wapoAdminToolApi/api/users';
		// vm.objUrl = 'http://155.207.19.237:8080/RESTMarks/api/account/';
		// vm.objUrl = 'http://wapo-apis.azurewebsites.net/api/v1//computables/cumulativeToInstant';
		// vm.objUrl = 'http://155.207.19.237:8080/eBucks/api/Order/';

		// vm.action = "";
		// vm.actionbutton = "";
		// vm.currentObj = {};
		vm.objs= {};
		vm.formObj = {};
		vm.formType = {};
		// vm.c ={};
		// vm.table = [];
		// vm.initObject = [];
		// vm.credentials =SignIn.credentials;
		vm.children= [];
		$scope.serviceName = config.serviceName;
		// vm.currentObject = {};

		vm.firstcall = function(){
			// CurrentOb.test().then(function(response){
				// vm.credentials = SignIn.credentials;
				vm.currentObject = CurrentOb.test();
				console.log(vm.currentObject.linkURI)
				// if( vm.currentObject.linkURI == undefined ){
				if( angular.isUndefined(vm.currentObject.linkURI)){
					console.log ("empty")

					vm.objUrl = config.apiUrl;

					// vm.objUrl = 'http://155.207.19.237:8080/RESTMarksFull/api/account/';
					// vm.objUrl = 'http://localhost:8080/RESTMarksFull/api/account';
					// vm.objUrl = 'http://109.231.121.89:8080/reviews/api/product';
					// vm.objUrl = 'http://localhost:8080/RESTMarksSimlpe/api/account';
					// vm.objUrl = 'http://localhost:8080/wapoAdminToolApi/api/users';

					console.log(vm.objUrl)
					vm.getObj();
				}
				else {
					vm.objUrl= vm.currentObject.linkURI;
					console.log ("full")
					console.log (vm.objUrl)
					// vm.objinit();
					vm.find(vm.parsedTable);
					// vm.setAction (vm.currentObject.linkVerb);
					vm.getObj();
				}
				// vm.getObj();
		// });
			
		};
		 
		// vm.currentObject = currentObject;

		// vm.objinit= function(){
		// 	// vm.table = vm.getschema();
		// 	YamlParse.getschema().then(function(response){
		// 		vm.table = response;
		// 	});
		// 	// console.log(vm.table)
		// 	var x = [];
		// 	// vm.table=YamlParse.calc();
		// 	var y = vm.table;
		// 	// console.log(y.length)
		// 	for(i=0; i<y.length; i++){
		// 	vm.initObject = vm.table[i];
		// 	x[i] = JSON.parse(vm.initObject);
		// 	// console.log(x);
		// 	}
		// 	console.log(x)
		// 	return x;
		// };

		// YamlParse.tara().then(function(response){
		// vm.parsedTable = response;

		// })

		vm.parsedTable=YamlParse.parsejson();

// =========== na metafero tin objinit() pano sto Yamlparser giati xreiazomai na kaleitai
// mono i find() kai na tin antikatastiso me kathe klisi stis objinit pio kato ==========

		vm.find = function(x){
			for (i = 0 ; i<x.length; i++){
				var y = x[i].Name;
				console.log(x.length)
				var k =new RegExp( y +'\/\\d{1,4}$');
				// console.log("RegExp " + k.test(vm.objUrl))
				if (k.test(vm.objUrl) || vm.objUrl.endsWith(y) ){
					vm.name = y;
					console.log(vm.name)
					console.log("vm.name")
					vm.formObj = {};
					for(j=0; j<x[i].Properties.length; j++){
						var key = x[i].Properties[j].Name;
						var type = x[i].Properties[j].Type;
						vm.formObj[key] = "" ;
						vm.formType[key] = type;
					}
					// console.log(vm.formType)
				}
			}
		};


		
		vm.passArguments = function(){
			
  			for (var key in vm.formObj) {
  				console.log(key);
  				console.log(vm.objs.hasOwnProperty(key));
			    if(vm.objs.hasOwnProperty(key) ) {
			    	console.log("has");
			      vm.formObj[key] = vm.objs[key];
			    }
			    else{console.log("fail");}
			  }

					 
		};

		

		vm.getObj = function(){
			
			
			// vm.credentials = $rootScope.credentials;

			// var credentials = btoa('sot1' + ':' + '1234');
			$http({
				method : 'get',
				url : vm.objUrl,
				// headers: {
				// 	'Authorization': 'Basic ' + vm.credentials,
				// 	'Content-Type': 'application/json'}
				headers : SignIn.headers
			})
			.then(function(response){
				
				// vm.objinit();
				vm.objs = response.data;
				vm.find(vm.parsedTable);
				vm.getChildren(response.data.linklist)
				// $scope.ob = response.data.linklist;
				// vm.properties = Object.getOwnPropertyNames(response.data);
				// console.log(vm.objs);
				// vm.passArguments ();
			}).catch(function(error){
				console.log(error)
			});
		};

		vm.getChildren = function(linklist){
			var promises = [];
			angular.forEach(linklist, function(link){
				if (link.linkType == "Child")
				{
				var deferred = $q.defer();
					$http({
						method : 'get',
							url : link.linkURI,
							// headers: {
							// 	'Authorization': 'Basic ' + $rootScope.credentials,
							// 'Content-Type': 'application/json'}
							headers : SignIn.headers
						})
					.then(function(response){
						var child=response.data;
						// console.log(child)
						vm.children.push(child);
						deferred.resolve();
					});
					promises.push(deferred.promise);
					// vm.children.push(
					// $http({
					// 	method : 'get',
					// 		url : link.linkURI,
					// 		headers: {
					// 			'Authorization': 'Basic ' + $rootScope.credentials,
					// 		'Content-Type': 'application/json'}
					// 	}).then(function(response){
					// 		return response.data;
					// 	})
					// )
				}
			});
			// setTimeout(function() {deferred.resolve(vm.childImg());}, 500);
			$q.all(promises).then(function(){
				vm.childImg();
			});
			// deferred.resolve(vm.childImg());
			// vm.childImg(vm.children);
			console.log(vm.children);
			console.log("vm.children");
			
		};
			
		vm.childImg = function(children){
			
			var promises = [];
				// console.log("wfwfwgwgwgwgwgwggwegwgw")
			angular.forEach(vm.children, function(child){
						var deferred = $q.defer();
				angular.forEach(child, function(key){
					if (typeof key == 'string'){
						var imgFormats = ['jpg','jpeg','gif','png','tif','bmp','ico'];
						for (i=0;i<imgFormats.length;i++){
							if(key.includes(imgFormats[i])){
								child.imageUrl2=key;
								deferred.resolve();
								// console.log(key)
							}
						}
					}
				});
					promises.push(deferred.promise);
			});
			// setTimeout(function() {deferred.resolve(vm.objImage());}, 10);
			// vm.objImage();
			$q.all(promises).then(function(){
				vm.objImage();
			});
		};

		vm.objImage= function(){
			angular.forEach(vm.objs.linklist, function(obj){
				angular.forEach(vm.children,function(child){
					angular.forEach(child,function(key){
						if (key == obj.linkRel)
							obj.imageUrl = child.imageUrl2;
							// console.log(obj)
					});
				});
			});
		};

		// vm.request = function(){
		// 	// var credentials = btoa('zolotas' + ':' + '0123456789');
		// 	$http({
		// 		method : vm.action,
		// 		url : vm.objUrl,
		// 		// headers: {
		// 		// 	'Authorization': 'Basic ' + vm.credentials,
		// 		// 'Content-Type': 'application/json'},
		// 		headers : SignIn.headers,
		// 		data: vm.formObj
		// 	})
		// 	.then(function(response){
		// 		// vm.objinit();
		// 		vm.find(vm.parsedTable);
		// 		vm.objs = response.data;
		// 		vm.getObj ();
		// 	console.log(vm.formObj);
		// 	});
		// };
		   

		vm.setCurrentObj= function(obj){
			$rootScope.currentObject = obj;
			console.log("------")
			// console.log(currentObject)
			// var check = Object.getOwnPropertyNames(vm.currentObj);
			// console.log(check);
			// console.log(obj);
			vm.objUrl = $rootScope.currentObject.linkURI;
			console.log(obj.linkVerb);
			// vm.setAction (obj.linkVerb);
			// vm.setFormObj(vm.objUrl );
			// vm.objinit();
			vm.find(vm.parsedTable);
			vm.getObj();
		};

		vm.actionCheck = function(obj){
			// console.log(linkVerb);
			if (obj.linkVerb == "POST") { vm.setCurrentObj(obj); $location.path("/edit"); }
			else if (obj.linkVerb == "PUT") {vm.setCurrentObj(obj); $location.path("/edit"); }
			else if (obj.linkVerb == "DELETE") { vm.deleteWarn(obj);}
			else if (obj.linkVerb == "GET") { 
				var uri = obj.linkURI.split("/");
				var uriEnding = uri[uri.length-1];
				console.log( "uriEnding: " + uriEnding);
				if (isNaN(uriEnding)){
					vm.setCurrentObj(obj);
					$location.path("/") ;

				}
				else {
					vm.setCurrentObj(obj);
				 	// vm = vm.new(true);
				 	// $scope = new{} ;
				 	vm.children2 = [];
				 	$scope.embededUri = '';
					vm.embededType ='';
					vm.embeded = false;
					vm.embededProperty ='';
				 	$location.path("/view");
				}
			}
				// { vm.setCurrentObj(obj); $location.path("/view") ; }
			// vm.action = obj.linkVerb;
		};

		// vm.setAction = function(linkVerb){
		// 	console.log(linkVerb);
		// 	if (linkVerb == "POST") { vm.actionbutton = "create"; }
		// 	else if (linkVerb == "PUT") { vm.actionbutton = "update" ;}
		// 	else if (linkVerb == "DELETE") { vm.actionbutton = "delete" ;}
		// 	else if (linkVerb == "GET") { vm.actionbutton = "" ;}
		// 	vm.action = linkVerb;
		// };

		vm.openSidebar = function(){
			$mdSidenav('left').open();
		};
		vm.closeSidebar = function(){
			$mdSidenav('left').close();
		};

		$scope.$on('GoHome',function(event){
			// Notification("GoHome")
			vm.firstcall();
		});
	// vm.getschema();
	console.log("first")
	vm.firstcall();
	// vm.objinit();
	// vm.parsefile();

	}]	);