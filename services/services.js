	app.service('YamlParse',function(config,$http){

		var vm = this;
		
		vm.table = [];
		vm.getschema = function(){
			return $http.get(config.yaml).then(function(response){
				var m =  vm.calc(response.data);
				for (i=0 ; i<m.length-1; i++){
				vm.table[i] = m[i+1];
				}
				return vm.table;
			});
		};

		vm.calc  = function(str){
			var entities = str.split("- !!eu.fp7.scase.inputParser.YamlResource");
			var entities_table = [];
			for (c=1; c<entities.length; c++){
				var entity_properties = entities[c].split("- ");
				var property_lines = [];
				var entity_name = entity_properties[0].split("\n");
				var entity_features = entity_properties[0].split("\n");
				var features =[]; 
				var featureTable= [];
				for (j=2; j<entity_features.length-3;j++){
					featureName = entity_features[j].split(": ")[0];
					featureValue = entity_features[j].split(": ")[1];
					featureTable +=  JSON.stringify(featureName.trim()) + ':' + JSON.stringify(featureValue) + ',';
				}
				featureName = entity_features[j].split(": ")[0];
				featureValue = entity_features[j].split(": ")[1];
				featureTable +=  JSON.stringify(featureName.trim()) + ':' + JSON.stringify(featureValue);
				var temp1 ;
				var prop_object;
				var i;
				var object_table ='{"Name": "' + entity_name[1].split(": ")[1].trim(); 
				object_table+= '",  "Properties" : [';
				if (entity_properties.length>1){
					for (j = 1 ; j< entity_properties.length-1; j++){
						property_lines = entity_properties[j].split("\n");
						prop_object = '{';
						for (i= 0; i < property_lines.length-2; i++){
							temp1 = property_lines[i].split(":");
							prop_object +=  JSON.stringify(temp1[0].trim()) + ":" + JSON.stringify(temp1[1].trim()) + ',';
						}
						temp1 = property_lines[i].split(":");
						prop_object +=  JSON.stringify(temp1[0].trim()) + ":" + JSON.stringify(temp1[1].trim()) + '}';
						object_table += prop_object + ',';

					}	
						property_lines = entity_properties[j].split("\n");
						prop_object = '{';
						for (i= 0; i < property_lines.length-4; i++){
							temp1 = property_lines[i].split(":");
							prop_object +=  JSON.stringify(temp1[0].trim()) + ":" + JSON.stringify(temp1[1].trim()) + ',';
						}
						temp1 = property_lines[i].split(":");
						prop_object +=  JSON.stringify(temp1[0].trim()) + ":" + JSON.stringify(temp1[1].trim());
						temp1 = property_lines[i+1].split(":");
						prop_object += '}],' + JSON.stringify(temp1[0].trim()) + ":" + JSON.stringify(temp1[1].trim()) ;
						object_table += prop_object +', "Features":{'+ featureTable+ '}}' ;
					}
					else { 
						object_table += '], "RelatedResources":' +'"'+ entity_properties[0].split("RelatedResources: ")[1].trim() + '"}';
					}
					entities_table[c] = object_table;
				}
			return entities_table;
		};

		vm.parsejson= function(){
					vm.getschema().then(function(response){
						vm.table = response;
					});
					var x = [];
					var y = vm.table;
					for(i=0; i<y.length; i++){
					vm.initObject = vm.table[i];
					x[i] = JSON.parse(vm.initObject);
					}
					console.log(x)
					return x;
				};

	});

	app.service('CurrentOb', function($rootScope){
		var vm=this;

		$rootScope.currentObject = {};
		$rootScope.previusObj = {};


		vm.test = function(){
			return $rootScope.currentObject;
		};

		vm.set=function(obj){
			if(obj){
				$rootScope.currentObject = obj;
			}
		};
	});

	app.service('SignIn',function($rootScope){
		var vm = this;

		$rootScope.credentials = "" ;
		vm.credentials="";
		vm.createHeader = function(){
			vm.headers = {'Authorization': 'Basic ' + vm.credentials,
					'Content-Type': 'application/json'};
				};

		// vm.headers = {'Authorization': 'Basic ' + btoa('test' + ':' + '1234'),
					// 'Content-Type': 'application/json'};
		
		$rootScope.signedIn = false;
	});