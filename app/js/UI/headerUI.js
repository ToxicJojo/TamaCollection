function showUser(user) {
  var database = firebase.database();

  database.ref('/users/' + user.uid).once('value', function(snapshot){
    var user = snapshot.val();

    
  });
}


exports.showUser = showUser;
