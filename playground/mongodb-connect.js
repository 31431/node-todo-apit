// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error,db)=>{
	if(error){
		return console.log('Unable to connect to mongodb');
	};
	console.log('Connected successfully to db');

	// db.collection('Todos').insertOne({
	// 	text: 'Something to do',
	// 	completed: false
	// },(error,result)=>{
	// 	if(error){
	// 		return console.log('Failed to insert todo ', error);
	// 	}
	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// })

	// db.collection('Users').insertOne({
	// 	name: 'Tai',
	// 	age: 22,
	// 	location: 'Singapore'
	// },(error,result)=>{
	// 	if(error){
	// 		return console.log('Unable to connect to the server '+ error);
	// 	}
	// 	console.log(result.ops[0]._id.getTimestamp());
	// })

	db.close();
} );

