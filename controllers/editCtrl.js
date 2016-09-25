app.controller('editCtrl',['config','$http','$scope','$rootScope','$location','$q','SignIn', 'YamlParse', 'CurrentOb', 'Notification', 
	function(config, $http,$scope,$rootScope,$location, $q, SignIn, YamlParse, CurrentOb, Notification){

		var vm = this;

		// vm.action = "";
		vm.actionbutton = "";
		vm.formObj = {};
		vm.formType = {};
		vm.formReq = {};
		// vm.table = [];
		// vm.imgUrl
		vm.currentObject = $rootScope.currentObject;


		vm.currentCkeck = function(){
			if (angular.isUndefined($rootScope.currentObject.linkURI) ){
			// if ($rootScope.currentObject.linkURI === undefined ){
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
				// headers: {
				// 	'Authorization': 'Basic ' + $rootScope.credentials,
				// 'Content-Type': 'application/json'}
				headers : SignIn.headers
			})
			.then(function(response){
				vm.objs = response.data;
				vm.find();
				vm.findReturnUri();
				// vm.setAction(vm.currentObject.linkVerb)
				// vm.properties = Object.getOwnPropertyNames(response.data);
				console.log(vm.objs);
				// vm.passArguments ();
				// vm.getChildrenList();
				// vm.setViewObj();
				// console.log(vm.viewObj)
			});
		
		};

		// vm.objinit= function(){
		// 	// vm.table = vm.getschema();
		// 	YamlParse.getschema().then(function(response){
		// 		vm.table = response;
		// 	console.log(vm.table)
		// 	var x = [];
		// 	// vm.table=YamlParse.calc();
		// 	var y = vm.table;
		// 	// console.log(y.length)
		// 	for(i=0; i<y.length; i++){
		// 	vm.initObject = vm.table[i];
		// 	x[i] = JSON.parse(vm.initObject);
		// 	console.log(x);
		// 	}
		// 	// console.log(x)
		// 	vm.find(x);
		// });
			
		// };

// =========== na metafero tin objinit() pano sto Yamlparser giati xreiazomai na kaleitai
// mono i find() kai na tin antikatastiso me kathe klisi stis objinit pio kato ==========
	vm.parsedTable=YamlParse.parsejson();
		vm.find = function(){
			for (i = 0 ; i<vm.parsedTable.length; i++){
				var y = vm.parsedTable[i].Name;
				console.log(vm.parsedTable.length)
				var k =new RegExp( y +'\/\\d{1,4}$');
				// console.log("RegExp " + k.test(vm.objUrl))
				if (k.test(vm.currentObject.linkURI) || vm.currentObject.linkURI.endsWith(y) ){
					vm.name = y;
					console.log(vm.name)
					console.log("vm.name")
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
					// console.log(vm.formType)
				}
			}
		};

		vm.passArguments = function(){
			console.log("1245")
			console.log(vm.formObj)
			console.log(vm.objs)
  			for (var key in vm.formObj) {
  				console.log(key);
  				console.log(vm.objs.hasOwnProperty(key));
			    if(vm.objs.hasOwnProperty(key) ) {
			    	// console.log("has");
			      vm.formObj[key] = vm.objs[key];
			    }
			    // else{console.log("fail");}
			  }

					 
		};

		vm.setCurrentObj= function(obj){
			var c= obj;
			$rootScope.previusObj = vm.currentObject;
			$rootScope.currentObject = obj;
			CurrentOb.set(c);
			console.log("ooooooooooooooooo")
			// var check = Object.getOwnPropertyNames(vm.currentObj);
			// console.log(check);
			console.log(obj);
			vm.objUrl = $rootScope.currentObject.linkURI;
			console.log(obj.linkVerb);
			// vm.setAction (obj.linkVerb);
			// vm.setFormObj(vm.objUrl );
			// vm.objinit();
			vm.getObj();
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
				vm.objs = response.data;
				vm.find();
				// vm.getObj ();
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
					// Notification("Please Sign In ");
					Notification.error({message: 'Please Sign In to complete this action'});
				}
			});
		};
		   
		vm.setAction = function(linkVerb){
			console.log(linkVerb);
			if (linkVerb == "POST") { vm.actionbutton = "create"; }
			else if (linkVerb == "PUT") { vm.actionbutton = "update" ;}
			else if (linkVerb == "DELETE") { vm.actionbutton = "delete" ;}
			else if (linkVerb == "GET") { vm.actionbutton = "" ;}
			// vm.action = linkVerb;
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
		vm.currentCkeck();
		vm.setAction(vm.currentObject.linkVerb);
	}]);