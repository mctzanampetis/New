app.controller('viewCtrl',['config','$http','$scope','$rootScope','$q','$location','$sce','$route','SignIn', 'YamlParse', 'CurrentOb','$mdDialog' , '$mdSidenav','Notification',
 function(config, $http,$scope,$rootScope,$q,$location,$sce,$route, SignIn, YamlParse, CurrentOb, $mdDialog, $mdSidenav, Notification){


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
				$location.path("/");
			}
			else {
				vm.getObj();
			}
		};

		

		vm.getObj = function(){
			$http({
				method : 'get',
				url : $rootScope.currentObject.linkURI,
				headers : SignIn.headers
			})
			.then(function(response){
				vm.objs = response.data;
				vm.find($rootScope.currentObject.linkURI);
				vm.embededCheck();
				vm.findReturnUri();
				vm.getChildrenList();
				vm.setViewObj();
			}).catch(function(error){
				console.log(error);
				$location.path("/");
			});
		
		};

		vm.request = function(){
			$http({
				method : $rootScope.currentObject.linkVerb,
				url : $rootScope.currentObject.linkURI,
				headers : SignIn.headers,
				data: vm.formObj
			})
			.then(function(response){
				vm.objs = response.data;
				vm.find($rootScope.currentObject.linkURI);
				vm.setCurrentObj($rootScope.previusObj);
				$location.path("/view");
			});
		};

			vm.delete = function(){
			$http({
				method : 'delete',
				url : $rootScope.currentObject.linkURI,
				headers : SignIn.headers,
				data: vm.formObj
			})
			.then(function(response){
				vm.objs = response.data;
				vm.find($rootScope.currentObject.linkURI);
				vm.setCurrentObj($rootScope.previusObj);
				$location.path("/view");
			})
			.catch(function(error){
				console.log(error);
				if (error.status == '403' || '401'){
					Notification.error("Please Sign In to complete this action");
				}
			});
		};

		
vm.parsedTable=YamlParse.parsejson();
		
		vm.embededCheck = function(){
			for (i = 0 ; i<vm.parsedTable.length; i++){
				var y = vm.parsedTable[i].Name;
				var k =new RegExp( y +'\/\\d{1,4}$');
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
				var k =new RegExp( y +'\/\\d{1,4}$');
				if (k.test(linkURI) || linkURI.endsWith(y) ){
					$rootScope.previousState = linkURI.split(k)[0];
					vm.name = y;
					vm.formObj = {};
					for(j=0; j<vm.parsedTable[i].Properties.length; j++){
						var key = vm.parsedTable[i].Properties[j].Name;
						var type = vm.parsedTable[i].Properties[j].Type;
						vm.formObj[key] = "" ;
						vm.formType[key] = type;
					}
					vm.passArguments ();
				}
			}
		};

		vm.passArguments = function(){
			for (var key in vm.formObj) {
  				if(vm.objs.hasOwnProperty(key) ) {
			      vm.formObj[key] = vm.objs[key];
			    }
			  }

					 
		};

		vm.setCurrentObj= function(obj){
			var c= obj;
			$rootScope.previusObj = $rootScope.currentObject;
			$rootScope.currentObject = obj;
			CurrentOb.set(c);
			vm.objUrl = $rootScope.currentObject.linkURI;
			vm.getObj();

		};

		vm.getChildrenList =function(){
			var c = 0;
			vm.children2=[];
			vm.childCategories = [];
			console.log("got children")
			console.log(vm.objs)
			$scope.hasChildren = false;
			angular.forEach(vm.objs.linklist, function(link){
				if ( link.linkType == "Child" && link.linkVerb == "GET"){
					$scope.hasChildren = true;
					$http({
							method : 'get',
							url : link.linkURI,
							headers : SignIn.headers
						})
						.then(function(response){
							
							angular.forEach(response.data.linklist , function(child){
								if (child.idType !== '0'){
									vm.find(child.linkURI);
									var category = vm.name;
									child.category = category;
									vm.children2.push(child);

									if (vm.childCategories.length === 0){
										vm.childCategories.push(category);
									}
									if(vm.childCategories.indexOf(category) === -1) {
									  vm.childCategories.push(category);
									}
									
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

								}
							});
							
						});
				}
			});
		};

		// vm.childrenDivide = function(){
		// 	var childCategory=[];
		// 	angular.forEach(vm.children, function(child){
		// 	vm.find(child.linkURI);
		// 	childCategory.push(vm.name)
		// 	});
		// };


		vm.imgtest = function(src){
			var imgFormats = ['jpg','jpeg','gif','png','tif','bmp','ico'];
			for (i=0;i<imgFormats.length;i++){
				if(src.endsWith(imgFormats[i])|| src.includes(imgFormats[i])){
					vm.imageUrl=src;
				}
			}
		};
		

		vm.setViewObj = function(){
			vm.viewObj = vm.objs;
			angular.forEach(vm.viewObj, function(key,atr){
				if (atr == vm.embededProperty){
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

			});
		};
		

		vm.goBack = function () {
		    window.history.back();
		}

		vm.return= function(){
			if (vm.returnObj.linkURI == config.apiUrl){
				vm.setCurrentObj(vm.returnObj);
				$location.path( "/" );
			}
			else {
				vm.setCurrentObj(vm.returnObj);
				vm.children2 = [];
				 	$scope.embededUri = '';
					vm.embededType ='';
					vm.embeded = false;
					vm.embededProperty ='';
				$location.path( "/view" );
			}
		};

		vm.findReturnUri=function(){
			angular.forEach(vm.objs.linklist, function(obj){
				if (obj.linkVerb == "GET" ){
					if (obj.linkType == 'Parent'){
						var uri = obj.linkURI.split("/");
						var uriEnding = uri[uri.length-1];
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
			if (obj.linkURI == config.apiUrl){
				vm.setCurrentObj(obj);
				$location.path( "/" );
			}
			else {
				vm.setCurrentObj($rootScope.previusObj);
				$location.path( "/view" );
			}

		};

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
			vm.action = obj.linkVerb;
		};

		vm.deleteWarn = function(obj){
		var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this ?')
          .ok('Please do it!')
          .cancel('Cancel');
	    $mdDialog.show(confirm).then(function() {
	      vm.closeSidebar();
	       vm.delete();
	    });
	};


		vm.openSidebar = function(){
			$mdSidenav('left').open();
		};
		vm.closeSidebar = function(){
			$mdSidenav('left').close();
		};
		
		vm.currentCkeck();
	}]);