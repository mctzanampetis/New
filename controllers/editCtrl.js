app.controller('editCtrl',['config','$http','$scope','$rootScope','$location','$q','SignIn', 'YamlParse', 'CurrentOb', 'Notification', 
	function(config, $http,$scope,$rootScope,$location, $q, SignIn, YamlParse, CurrentOb, Notification){

		var vm = this;

		vm.actionbutton = "";
		vm.formObj = {};
		vm.formType = {};
		vm.formReq = {};
		vm.currentObject = $rootScope.currentObject;


		vm.currentCkeck = function(){
			if (angular.isUndefined($rootScope.currentObject.linkURI) ){
				$location.path("/");
				console.log ("redirected")
			}
			else {

				vm.getObj();
			}
		};

		vm.getObj = function(){
			
			var credentials = btoa('test12' + ':' + '1234');
			$http({
				method : 'get',
				url : $rootScope.currentObject.linkURI,
				headers : SignIn.headers
			})
			.then(function(response){
				vm.objs = response.data;
				vm.find();
				vm.findReturnUri();
			});
		
		};

		
		
	vm.parsedTable=YamlParse.parsejson();
		vm.find = function(){
			for (i = 0 ; i<vm.parsedTable.length; i++){
				var y = vm.parsedTable[i].Name;
				var k =new RegExp( y +'\/\\d{1,4}$');
				if (k.test(vm.currentObject.linkURI) || vm.currentObject.linkURI.endsWith(y) ){
					vm.name = y;
					vm.formObj = {};
					for(j=0; j<vm.parsedTable[i].Properties.length; j++){
						var key = vm.parsedTable[i].Properties[j].Name;
						var type = vm.parsedTable[i].Properties[j].Type;
						var required = vm.parsedTable[i].Properties[j].Required;
						vm.formObj[key] = "" ;
						vm.formType[key] = type;
						vm.formReq[key] = required;
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
			$rootScope.previusObj = vm.currentObject;
			$rootScope.currentObject = obj;
			CurrentOb.set(c);
			vm.objUrl = $rootScope.currentObject.linkURI;
			vm.getObj();
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
				vm.find();
				if($rootScope.currentObject.linkVerb == 'POST'){
					Notification("Succesfully Created! ");
				}
				else if($rootScope.currentObject.linkVerb == 'PUT'){
					Notification("Succesfully Updated! ");
				}
				vm.setCurrentObj($rootScope.previusObj)
				$location.path("/view")
			console.log(vm.formObj);
			})
			.catch(function(error){
				console.log(error)
				if (error.status == '403' || '401'){
					Notification.error({message: 'Please Sign In to complete this action'});
				}
			});
		};
		   
		vm.setAction = function(linkVerb){
			if (linkVerb == "POST") { vm.actionbutton = "create"; }
			else if (linkVerb == "PUT") { vm.actionbutton = "update" ;}
			else if (linkVerb == "DELETE") { vm.actionbutton = "delete" ;}
			else if (linkVerb == "GET") { vm.actionbutton = "" ;}
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
		vm.currentCkeck();
		vm.setAction(vm.currentObject.linkVerb);
	}]);