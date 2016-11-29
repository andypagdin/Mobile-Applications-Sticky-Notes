app.controller( 'addPadCtrl', function ( $scope, Firebase )
{
	$scope.page_data = {}
    $scope.page_data.groups = {}
    $scope.page_data.group_models = {}
    $scope.page_data.pad_models = {}
    $scope.page_data.pad_models["-KXNSUDZByXtgP6KaCQe"] = {} 
    $scope.page_data.comment_models = {}
    $scope.page_data.currentGroup = {
    	id:"-KXNSUDZByXtgP6KaCQe",
    	title:"",
    	body:"",
    }
    var group_ids = {}

	$scope.create_pad = function () {
        var title = $scope.page_data.currentGroup.title
        var body = $scope.page_data.currentGroup.body
        var input = {
            group_id: $scope.page_data.currentGroup.id,
            title: title,
            body: body,
        }        
        $scope.page_data.currentGroup.title = "";
        $scope.page_data.currentGroup.body = "";
        Firebase.post_pad(input)
            .then(function (new_object) {            	
                pads_object = $scope.page_data.groups[group_id].pads                
                if (!pads_object) {
                    pads_object = {}
                    pads_object.length = 0
                }
                pads_object[new_object.id] = {}
                pads_object[new_object.id] = new_object
                pads_object.length++
                console.log("pads_object", pads_object)
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
            })
    }


} );