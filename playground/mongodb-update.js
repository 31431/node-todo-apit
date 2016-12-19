const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
	if(err){
		return console.log('Unable to connect to DB');
	}
	console.log('Connected to MongoDB server');

	db.collection('Users').findOneAndUpdate({
		_id: ObjectID('58561a9f6848e20355c68488')
	},{
		$set: {
			name: 'Krittin'
		}
	},{
		returnOriginal: false
	}).then((result)=>{
		console.log(result);
	});

	db.collection('Users').findOneAndUpdate({
		_id: ObjectID('58561a9f6848e20355c68488')
	},{
		$inc: {
			age: 2
		}
	},{returnOriginal: false}).then((result)=>{
		console.log(result);
	})

})