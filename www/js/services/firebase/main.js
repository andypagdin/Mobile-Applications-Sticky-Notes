//////////////////////////////////
//firebaseServ start
//////////////////////////////////

app.factory('Firebase', function ($q) {
	get_user = function (uuid) {
		return firebase.database().ref('/users/').child(uuid).once('value', function (data) {
			console.log(uuid, data.val())
			return data;
		})
	}
	get_groups = function (group_ids) {
		promise = []
		keys = Object.keys(group_ids)
		for (var i = 0; i < keys.length; i++) {
			group_id = group_ids[keys[i]]
			current_group_id = keys[i]
			promise.push($q(function (resolve, reject) {
				if (!group_id.read) {
					return firebase.database().ref('/groups/').child(current_group_id).once("value", function (groups) {
						resolve(groups.val());
					}).catch(reject);
				}
				else {
					resolve();
				}
			}))
		}
		return $q.all(promise).then(function (outcome) {
			var outcome_obj = {}
			//clears out all undefined outputs and turns it into an object
			for (var i = 0; i < outcome.length; i++) {
				if (outcome[i]) {
					group_id = outcome[i].id
					outcome_obj[group_id] = outcome[i]
				}
			};
			//set lengths of each sub object
			outcome_obj.length = Object.keys(outcome_obj).length
			outcome_obj_keys = Object.keys(outcome_obj)
			for (var i = 0; i < outcome_obj.length; i++) {
				outcome = outcome_obj[outcome_obj_keys[i]]
				users = outcome.users
				users.length = Object.keys(users).length
				pads = outcome.pads
				pad_keys = Object.keys(pads)
				pads.length = Object.keys(pads).length
				for (var x = 0; x < pads.length; x++) {
					pad_obj = pads[pad_keys[x]]
					pad_obj.new_comment = ""
					comments = pad_obj.comments
					comments.length = Object.keys(comments).length
				};
			};
			return outcome_obj;
		}, function (reason) {
			console.error('Failed: ', reason);
			return reason;
		});
	}
	post = function(arg){
		var ref = firebase.database().ref(arg.url);
		var id = ref.push().key;
		output = arg.output
		output.id = id
		output.timestamp = Date.now()
		// call storage to get uuid here.
	    uuid = 'Ucg7kUNTceQjOLqDIwByHLz5FPj2'
		output.created_by = uuid
		console.log("[post][output]",output)
		return ref.child(id).set(output).then(function () {
			return output;
		}).catch(function (error) {
			console.error("error", error)
		});
	}
	post_group = function (arg) {
		console.log("[post_group][arg]",arg)
		var data = {
			url: `/groups/`,
			output:{
				title: arg.title
			}
		}
		console.log("[post_group][data]",data)
		return post(data)
	}
	post_pad = function (arg) {
		console.log("[post_pad][arg]",arg)
		var data = {
			url: `/groups/${arg.group_id}/pads/`,
			output:{
				title: arg.title,
				body: arg.body
			}
		}
		console.log("[post_pad][data]",data)
		return post(data)
	}
	post_comment = function (arg) {
		console.log("[post_comment][arg]",arg)
		var data = {
			url: `/groups/${arg.group_id}/pads/${arg.pad_id}/comments/`,
			output:{
				body: arg.body
			}
		}
		console.log("[post_comment][data]",data)
		return post(data).then(function(){
			var new_comment = {
				id: output.id,
				body: output.body,
				timestamp: output.timestamp,
				created_by: output.created_by,
			}
			return new_comment;
		})
	}
	flat_stub = function () {
		return firebase.database().ref("").once('value', function (data) {
			return data;
		})
	}
	return {
		get_user: get_user,
		get_groups: get_groups,
		post_group: post_group,
		post_pad: post_pad,
		post_comment: post_comment
	};
});

//////////////////////////////////
//firebaseServ end
//////////////////////////////////

