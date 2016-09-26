/**
* @ngdoc controller
* @name myApp.controller:mainCtrl
* @descripton:
*
*This is the controller respnsible to show the list of the resourse's options for the user. 
* It divides the the options in two lists, the first is the children of the resource and the other, 
* which can be found if user clicks the "More Options" button, is the list of the available CRUD activities.
* 
**/

app.controller('mainCtrl',['config','$http','$q','$scope','$rootScope','$location', 'YamlParse', 'CurrentOb', 'Notification','SignIn','$mdSidenav',
	 function(config, $http,$q,$scope,$rootScope,$location, YamlParse, CurrentOb, Notification, SignIn,$mdSidenav){
		
		var vm = this;
		
		
		vm.objs= {};
		// vm.formObj = {};
		// vm.formType = {};
		vm.children= [];
		$scope.serviceName = config.serviceName;


		/**
		* @ngdoc method
		* @name currentCheck
		* @methodOf myApp.controller:mainCtrl
		* @descripton
		*
		*This method is called first when the controller is been referenced to check if 
		* the current object is defined. If the object is defined it calls getObj() 
		* else it defines the current object from the main resource uri (apiUrl) which is given in the conf.js file.
		* 
		**/

		vm.firstcall = function(){
			
				vm.currentObject = CurrentOb.test();
				if( angular.isUndefined(vm.currentObject.linkURI)){

					vm.objUrl = config.apiUrl;

					console.log(vm.objUrl);
					vm.getObj();
				}
				else {
					vm.objUrl= vm.currentObject.linkURI;
					console.log (vm.objUrl)
					// vm.find(vm.parsedTable);
					vm.getObj();
				}
		};
		 
		

		// vm.parsedTable=YamlParse.parsejson();

		// vm.find = function(x){
		// 	for (i = 0 ; i<x.length; i++){
		// 		var y = x[i].Name;
		// 		var k =new RegExp( y +'\/\\d{1,4}$');
		// 		if (k.test(vm.objUrl) || vm.objUrl.endsWith(y) ){
		// 			vm.name = y;
		// 			vm.formObj = {};
		// 			for(j=0; j<x[i].Properties.length; j++){
		// 				var key = x[i].Properties[j].Name;
		// 				var type = x[i].Properties[j].Type;
		// 				vm.formObj[key] = "" ;
		// 				vm.formType[key] = type;
		// 			}
					
		// 		}
		// 	}
		// };


		
		// vm.passArguments = function(){
		// 	for (var key in vm.formObj) {
		// 		console.log(key);
		// console.log(vm.objs.hasOwnProperty(key));
		// 	    if(vm.objs.hasOwnProperty(key) ) {
		// 	    	console.log("has");
		// 	      vm.formObj[key] = vm.objs[key];
		// 	    }
		// 	    else{console.log("fail");}
		// 	  }

					 
		// };

		/**
		* @ngdoc method
		* @name getObj
		* @methodOf myApp.controller:mainCtrl
		* @descripton
		*
		*This method is called from  firstcall() and setCurrentObj(). It sends an HTTP GET request
		* to retrieve data of the current object. Then it stores the response data to the variable 
		* objs and calls the function getChildren().
		**/

		vm.getObj = function(){
			
			$http({
				method : 'get',
				url : vm.objUrl,
				headers : SignIn.headers
			})
			.then(function(response){
				
				vm.objs = response.data;
				// vm.find(vm.parsedTable);
				vm.getChildren(response.data.linklist)
			}).catch(function(error){
				console.log(error)
			});
		};

		/**
		* @ngdoc method
		* @name getChildren
		* @methodOf myApp.controller:mainCtrl
		* @descripton
		*
		*This method is called from  getObj() function. It creates a loop and sends an HTTP GET request
		*  for every child of the resource and then stores children to the children[] array. 
		* When the loop finishes, the childImg() function is called.
		*
		**/

		vm.getChildren = function(linklist){
			var promises = [];
			angular.forEach(linklist, function(link){
				if (link.linkType == "Child")
				{
				var deferred = $q.defer();
					$http({
						method : 'get',
							url : link.linkURI,
							headers : SignIn.headers
						})
					.then(function(response){
						var child=response.data;
						vm.children.push(child);
						deferred.resolve();
					});
					promises.push(deferred.promise);
				}
			});
			$q.all(promises).then(function(){
				vm.childImg();
			});
		};

		/**
		* @ngdoc method
		* @name childImg
		* @methodOf myApp.controller:mainCtrl
		* @descripton
		*
		*This method is called from  getChildren() function. It creates a loop and sends an HTTP GET request
		*  for every child in the children[] array. Then it creates another loop for the attributes of each child
		* and check if the attribute is an image. When the loops finsh it calls the objImage() function.
		*
		**/
			
		vm.childImg = function(children){
			
			var promises = [];
			angular.forEach(vm.children, function(child){
						var deferred = $q.defer();
				angular.forEach(child, function(key){
					if (typeof key == 'string'){
						var imgFormats = ['jpg','jpeg','gif','png','tif','bmp','ico'];
						for (i=0;i<imgFormats.length;i++){
							if(key.includes(imgFormats[i])){
								child.imageUrl2=key;
								deferred.resolve();
							}
						}
					}
				});
				promises.push(deferred.promise);
			});
			$q.all(promises).then(function(){
				vm.objImage();
			});
		};

		/**
		* @ngdoc method
		* @name objImage
		* @methodOf myApp.controller:mainCtrl
		* @descripton
		*
		*This method is called from  childImg() function. It creates a triple loop to pass to every child 
		* a new attribute which is the imageUrl and so it can preview the images. 
		**/

		vm.objImage= function(){
			angular.forEach(vm.objs.linklist, function(obj){
				angular.forEach(vm.children,function(child){
					angular.forEach(child,function(key){
						if (key == obj.linkRel)
							obj.imageUrl = child.imageUrl2;
					});
				});
			});
		};

		
		/**
		* @ngdoc method
		* @name setCurrentObj
		* @methodOf myApp.controller:mainCtrl
		* @descripton
		*
		*This method is called from the actionCheck() function. It stores the new object to the current of the rootScope.
		* and the uri of the current to the variable objUrl which is used from the getObj function to make the 
		* GET request. Finaly it calls the getObj() function.
		**/   

		vm.setCurrentObj= function(obj){
			$rootScope.currentObject = obj;
			vm.objUrl = $rootScope.currentObject.linkURI;
			// vm.find(vm.parsedTable);
			vm.getObj();
		};


	/**
		* @ngdoc method
		* @name actionCheck
		* @methodOf myApp.controller:mainCtrl
		* @descripton
		*
		*This method is called from the actionCheck() function. It stores the new object to the current of the rootScope.
		* and the uri of the current to the variable objUrl which is used from the getObj function to make the 
		* GET request. Finaly it calls the getObj() function.
		**/   

		vm.actionCheck = function(obj){
			if (obj.linkVerb == "POST") { vm.setCurrentObj(obj); $location.path("/edit"); }
			else if (obj.linkVerb == "PUT") {vm.setCurrentObj(obj); $location.path("/edit"); }
			else if (obj.linkVerb == "DELETE") { vm.deleteWarn(obj);}
			else if (obj.linkVerb == "GET") { 
				var uri = obj.linkURI.split("/");
				var uriEnding = uri[uri.length-1];
				if (isNaN(uriEnding)){
					vm.setCurrentObj(obj);
					$location.path("/") ;

				}
				else {
					vm.setCurrentObj(obj);
				 	vm.children2 = [];
				 	$scope.embededUri = '';
					vm.embededType ='';
					vm.embeded = false;
					vm.embededProperty ='';
				 	$location.path("/view");
				}
			}
		};

		

		vm.openSidebar = function(){
			$mdSidenav('left').open();
		};
		vm.closeSidebar = function(){
			$mdSidenav('left').close();
		};

		$scope.$on('GoHome',function(event){
			vm.firstcall();
		});
	vm.firstcall();
}]	);