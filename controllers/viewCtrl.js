app.controller('viewCtrl',['config','$http','$scope','$rootScope','$q','$location','$sce','$route','SignIn', 'YamlParse', 'CurrentOb','$mdDialog' , '$mdSidenav','Notification',
 function(config, $http,$scope,$rootScope,$q,$location,$sce,$route, SignIn, YamlParse, CurrentOb, $mdDialog, $mdSidenav, Notification){

		// var vm = vm.$new(true);

		var vm = this;

		vm.formObj = {};
		vm.formType = {};
		vm.table = [];
		vm.imgUrl
		vm.currentObject = $rootScope.currentObject;
		vm.children=[];
		vm.children2=[];
		$scope.limit =1;
		$scope.embededUri = '';
		vm.embededType ='';
		vm.embeded = false;
		vm.embededProperty ='';

		vm.currentCkeck = function(){
			if (angular.isUndefined($rootScope.currentObject.linkURI)){
			// if ($rootScope.currentObject.linkURI === undefined ){
				$location.path("/");
				console.log ("redirected")
			}
			else {
				// $route.reload();
				vm.getObj();
			}
		};

		

		vm.getObj = function(){
			// console.log("100000001010101010101010101010")
			// var credentials = btoa('sot1' + ':' + '1234');
			$http({
				method : 'get',
				url : $rootScope.currentObject.linkURI,
				// headers: {
				// 	'Authorization': 'Basic ' + $rootScope.credentials,
				// 'Content-Type': 'application/json'}
				headers : SignIn.headers
			})
			.then(function(response){
				// vm.objinit();
				vm.objs = response.data;
				vm.find($rootScope.currentObject.linkURI);
				vm.embededCheck();
				vm.findReturnUri();
				// vm.properties = Object.getOwnPropertyNames(response.data);
				console.log(vm.objs);
				// vm.passArguments ();
				vm.getChildrenList();
				vm.setViewObj();
				// console.log(vm.viewObj)
			}).catch(function(error){
				$location.path("/");
			})
		
		};

		vm.request = function(){
			// var credentials = btoa('zolotas' + ':' + '0123456789');
			$http({
				method : $rootScope.currentObject.linkVerb,
				url : $rootScope.currentObject.linkURI,
				// headers: {
				// 	'Authorization': 'Basic ' + $rootScope.credentials,
				// 'Content-Type': 'application/json'},
				headers : SignIn.headers,
				data: vm.formObj
			})
			.then(function(response){
				// vm.objinit();
				vm.objs = response.data;
				vm.find($rootScope.currentObject.linkURI);
				// vm.getObj ();
			console.log(vm.formObj);
			vm.setCurrentObj($rootScope.previusObj)
				$location.path("/view")
			});
		};

			vm.delete = function(){
			// var credentials = btoa('zolotas' + ':' + '0123456789');
			$http({
				method : 'delete',
				url : $rootScope.currentObject.linkURI,
				// headers: {
				// 	'Authorization': 'Basic ' + $rootScope.credentials,
				// 'Content-Type': 'application/json'},
				headers : SignIn.headers,
				data: vm.formObj
			})
			.then(function(response){
				// vm.objinit();
				vm.objs = response.data;
				vm.find($rootScope.currentObject.linkURI);
				// vm.getObj ();
			console.log(vm.formObj);
			vm.setCurrentObj($rootScope.previusObj)
				$location.path("/view")
			})
			.catch(function(error){
				console.log(error)
				if (error.status == '403' || '401'){
					Notification.error("Please Sign In to complete this action");
				}
			});
		};

		// vm.objinit= function(){
		// 	// vm.table = vm.getschema();
		// 	YamlParse.getschema().then(function(response){
		// 		vm.table = response;
		// 	console.log(vm.table)
		// 	vm.x = [];
		// 	// vm.table=YamlParse.calc();
		// 	var y = vm.table;
		// 	// console.log(y.length)
		// 	for(i=0; i<y.length; i++){
		// 	vm.initObject = vm.table[i];
		// 	vm.x[i] = JSON.parse(vm.initObject);
		// 	// console.log(vm.x);
		// 	}
		// 	// console.log(x)
		// 	vm.find($rootScope.currentObject.linkURI);
		// });
			
		// };

// =========== na metafero tin objinit() pano sto Yamlparser giati xreiazomai na kaleitai
// mono i find() kai na tin antikatastiso me kathe klisi stis objinit pio kato ==========
vm.parsedTable=YamlParse.parsejson();
		
		vm.embededCheck = function(){
			for (i = 0 ; i<vm.parsedTable.length; i++){
				var y = vm.parsedTable[i].Name;
				// console.log(y)
				var k =new RegExp( y +'\/\\d{1,4}$');
				// console.log(linkURI)
				// console.log("RegExp " + k.test(linkURI))
				if (k.test($rootScope.currentObject.linkURI) || $rootScope.currentObject.linkURI.endsWith(y) ){
					if (vm.parsedTable[i].Features.embededObjects == 'true'){
						vm.embeded = true;
						vm.embededType = vm.parsedTable[i].Features.embededType;
						vm.embededProperty = vm.parsedTable[i].Features.embededProperty;
						console.log(vm.embededType)
					}
				}
			}
		};

		vm.find = function(linkURI){
			for (i = 0 ; i<vm.parsedTable.length; i++){
				var y = vm.parsedTable[i].Name;
				// console.log(y)
				var k =new RegExp( y +'\/\\d{1,4}$');
				// console.log(linkURI)
				// console.log("RegExp " + k.test(linkURI))
				if (k.test(linkURI) || linkURI.endsWith(y) ){
					$rootScope.previousState = linkURI.split(k)[0];
					console.log("uri:"+linkURI)
					console.log("previous :"+$rootScope.previousState)
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
					// vm.embeded = false;
					// vm.embededType=[];
					// if (vm.parsedTable[i].Features.embededObjects == 'true'){
					// 	vm.embeded = true;
					// 	vm.embededType = vm.parsedTable[i].Features.embededType;
					// 	vm.embededProperty = vm.parsedTable[i].Features.embededProperty;
					// 	console.log(vm.embededType)
					// }
					vm.passArguments ();
					// console.log(vm.formType)
				}
			}
		};

		vm.passArguments = function(){
			// console.log("1245")
			// console.log(vm.formObj)
			// console.log(vm.objs)
  			for (var key in vm.formObj) {
  				// console.log(key);
  				// console.log(vm.objs.hasOwnProperty(key));
			    if(vm.objs.hasOwnProperty(key) ) {
			    	// console.log("has");
			      vm.formObj[key] = vm.objs[key];
			    }
			    // else{console.log("fail");}
			  }

					 
		};

		vm.setCurrentObj= function(obj){
			var c= obj;
			$rootScope.previusObj = $rootScope.currentObject;
			$rootScope.currentObject = obj;
			CurrentOb.set(c);
			console.log("ooooooooooooooooo")
			// var check = Object.getOwnPropertyNames(vm.currentObj);
			// console.log(check);
			// console.log(obj);
			vm.objUrl = $rootScope.currentObject.linkURI;
			// console.log(obj.linkVerb);
			// vm.setAction (obj.linkVerb);
			// vm.setFormObj(vm.objUrl );
			// vm.objinit();
			vm.getObj();
			console.log("new object")

		};

		vm.getChildrenList =function(){
			var c = 0;
			// vm.children=[];
			vm.children2=[];
			vm.childCategories = [];
			console.log("got children")
			console.log(vm.objs)
			$scope.hasChildren = false;
			angular.forEach(vm.objs.linklist, function(link){
				// link.linkType == "Child" &&
				// if ( link.idType != '0'){
				if ( link.linkType == "Child" && link.linkVerb == "GET"){
					// var credentials = btoa('sot12' + ':' + '1234');
					$scope.hasChildren = true;
					$http({
							method : 'get',
							url : link.linkURI,
							// headers: {
							// 	'Authorization': 'Basic ' + $rootScope.credentials,
							// 'Content-Type': 'application/json'}
							headers : SignIn.headers
						})
						.then(function(response){
							// vm.objinit();
							console.log(response.data.linklist)
							// vm.children=response.data
							// for (i=0;i>response.data.linklist.length;i++){
							// 	if(response.data.linklist[i].idType !='0'){
							// 		console.log(response.data.linklist[i])
							// 		vm.children2.push( response.data[i]);
							// 	}
							// }
								
									
									// vm.children2= [];
							angular.forEach(response.data.linklist , function(child){
								if (child.idType !== '0'){
									 // c = c+1;
									// vm.children{c} = child;
									vm.find(child.linkURI);
									var category = vm.name;
									console.log(vm.name)
									console.log(category)
									child.category = category;
									vm.children2.push(child);

									if (vm.childCategories.length === 0){
										vm.childCategories.push(category);
									}
									if(vm.childCategories.indexOf(category) === -1) {
									  vm.childCategories.push(category);
									}


									// vm.childCategories.push(category)
									// if (vm.children.hasOwnProperty(category)){
										
									// 	// vm.children[category].push(child);

									// }
									// else
									// {
									// 	vm.childCategories.push(vm.name);
									// 	vm.children[category] = [];
									// 	vm.children[category].push( child);
									// }
									if( vm.children.length === 0 ) {
										vm.children.push({'name': category, 'contents': []});
									}
									var newentry = true;
									for(i=0; i<vm.children.length; i++){
										if (vm.children[i].name == category){
											vm.children[i].contents.push(child);
											newentry = false;
										}
									}
									if(newentry){
										vm.children.push({'name': category, 'contents': []});
									}

									// if (vm.children.chlid.name == category){
									// 	vm.children.child.contents.push(child);
									// }
									// else {
									// 	vm.children.child= {'name':category, 'contents':[]};
									// 	vm.children.child.contents.push(child) 
									// }
									// vm.children.push({category:child});
								}
							});
							// vm.find(link.linkURI);
							// vm.childrenDivide();
							// vm.properties = Object.getOwnPropertyNames(response.data);
							// angular.forEach(vm.children,function(cat){
							// 	console.log(vm.children[cat])
							// })
							console.log(vm.children);
							console.log(vm.childCategories);
							// console.log(vm.children[1].name);

							// vm.passArguments ();
						});
				}
			});
		};

		vm.childrenDivide = function(){
				var childCategory=[];
			angular.forEach(vm.children, function(child){
				// var defferd = $q.deffer;
				vm.find(child.linkURI);

				// console.log(child.linkURI)
				// console.log(vm.name)
				childCategory.push(vm.name)
			})

			// console.log(vm.children)
			console.log(childCategory);
		};


		vm.imgtest = function(src){
			// console.log(src)
			var imgFormats = ['jpg','jpeg','gif','png','tif','bmp','ico'];
			for (i=0;i<imgFormats.length;i++){
				if(src.endsWith(imgFormats[i])|| src.includes(imgFormats[i])){
					vm.imageUrl=src;
				}
			}
		};
		

		vm.setViewObj = function(){
			vm.viewObj = vm.objs;
			// delete vm.viewObj.linklist;
			// angular.forEach(vm.viewObj, function(key){
			// 	if (typeof key == 'string'){
			// 	vm.imgtest(key);
			// }
			 // delete $scope.embededUri
			angular.forEach(vm.viewObj, function(key,atr){
				console.log(key);
				if (atr == vm.embededProperty){
				console.log("atr:"+ atr);
				switch(vm.embededType){
					case 'image': 
						$scope.embededUri = key;
						break;
					case 'video':
						$scope.embededUri = $sce.trustAsResourceUrl(key);
						break;
					case 'code':
						console.log(key+"-----------------")
						// $scope.embededUri = $sce.trustAsResourceUrl(key);
						if(key){
						$http.get(key).then(function(response){
							$scope.embededUri = response.data;
						});
						}	
						break;
					case 'map':
						$scope.embededUri = $sce.trustAsResourceUrl("https://www.google.com/maps/embed/v1/view?zoom=12&center="+key+"&key=AIzaSyCKmqYCxEYZBk2mHtDCN95gcklDJm6RHlM");
				}
			}

			// 	 console.log(key)
			// 	if ($scope.result){
			// 		vm.imgUrl = key;
			// 		console.log("YO!!")

			// }
			});
		};
		

		vm.goBack = function () {
		    window.history.back();
		}

		vm.return= function(){
			// $http.get(vm.returnUri,SignIn.headers)
			// .then(function(response){
			if (vm.returnObj.linkURI == config.apiUrl){
				vm.setCurrentObj(vm.returnObj);
				$location.path( "/" );
			}
			else {
				// vm.setCurrentObj($rootScope.currentObject);
				vm.setCurrentObj(vm.returnObj);
				vm.children2 = [];
				 	$scope.embededUri = '';
					vm.embededType ='';
					vm.embeded = false;
					vm.embededProperty ='';
				$location.path( "/view" );
			}
			// })
		};

		vm.findReturnUri=function(){
			angular.forEach(vm.objs.linklist, function(obj){
				if (obj.linkVerb == "GET" ){
					console.log(obj.linkType);
					if (obj.linkType == 'Parent'){
						var uri = obj.linkURI.split("/");
						var uriEnding = uri[uri.length-1];
						console.log( "uriEnding: " + uriEnding);
						if (!isNaN(uriEnding)){
							vm.returnUri = obj.linkURI;	
							vm.returnObj = obj;		
						}
						else if (obj.linkURI == config.apiUrl){
							vm.returnUri = obj.linkURI;	
							vm.returnObj = obj;	
						}
					}
					
				}
			});
		};

		vm.urlCheck = function(obj){
			// var baseUrl = 'http://109.231.121.89:8080/reviews/api/product';
			if (obj.linkURI == config.apiUrl){
				vm.setCurrentObj(obj);
				$location.path( "/" );
			}
			else {
				// vm.setCurrentObj($rootScope.currentObject);
				vm.setCurrentObj($rootScope.previusObj);
				$location.path( "/view" );
			}

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
			// else if (obj.linkVerb == "GET") { vm.setCurrentObj(obj); $location.path("/view") ; }
			vm.action = obj.linkVerb;
		};

		vm.deleteWarn = function(obj){
		// $http.get(uri.linkURI)
		// .then(function(response){
		// 	$scope.delbookmark = response.data;
		// });

		var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this ?')
          .ok('Please do it!')
          .cancel('Cancel');
	    $mdDialog.show(confirm).then(function() {
	      vm.closeSidebar();
	      // vm.request();
	       vm.delete();
	    });
	};


		vm.openSidebar = function(){
			$mdSidenav('left').open();
		};
		vm.closeSidebar = function(){
			$mdSidenav('left').close();
		};
		
		// vm.getObj();
		vm.currentCkeck();
	}]);