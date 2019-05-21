//Matching System
app.post('/api/setNewMatch/',function(req,res){
	
	var _uid = req.body.uid;
    var _targetUid = req.body.tuid;
    
	if(_uid != _targetUid){
	   var data = {
		  requestMatches: [_targetUid],
		  requestMatchesDate :[],
		};
		var matchesRef = firestore.collection('Matches').doc(_uid);
	 	 firestore.collection('Matches').doc(_uid)
		  .get().then(
		  doc => {
			if (doc.exists) {
					var arrUnion = matchesRef.update({
						requestMatches : admin.firestore.FieldValue.arrayUnion(_targetUid)
					});
				//	console.log("you've sent cathing request");
					isMatch(_uid,_targetUid);
					res.end();
			}
			else{
				var addMatchesFiled = firestore.collection('Matches').doc(_uid).set(data);
				//	console.log("you've sent cathing request");
					isMatch(_uid,_targetUid);
				    res.end();
			}
		  });
	}
});


app.post('/api/unMatch/',function(req,res){
    var _uid = req.body.uid;
    var _targetUid = req.body.tuid;
    
    var requestMatches =[];

    var matchRef = firestore.collection('Matches').doc(_targetUid);
    var matchesRef = firestore.collection('Matches').doc(_uid);

    var getDoc = matchesRef.get()
      .then(doc => {
        if (!doc.exists) {
        //  console.log('No document');
          res.end();
        } else {
            requestMatches.push(doc.data()['Matched']);	
            requestMatches.forEach(function(element) {
                element.forEach(function(arr) {
                        if(arr == _targetUid){
                            // console.log("UNMATCH !");
                            var arrUnion = matchesRef.update({
                                Matched : admin.firestore.FieldValue.arrayRemove(_targetUid)
                            });
                            var arrUnion = matchRef.update({
                                Matched : admin.firestore.FieldValue.arrayRemove(_uid)
                            });	
                            res.end();
                        }
                        else{
                            //console.log("you already dont have match");
                            res.end();
                    }
                });
            });
        }
      })
      .catch(err => {
        //console.log('Error getting document', err);
        res.end();
      });	  
});