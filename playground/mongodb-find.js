// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (error,db)=>{
	if(error){
		return console.log('Unable to connect to mongodb');
	};
	console.log('Connected successfully to db');

	// db.collection('Todos').find({
	// 	_id: new ObjectID('58561c4b387a2fdf0e9f6955')
	// }).toArray().then((docs)=>{
	// 	console.log('Todos: ');
	// 	console.log(JSON.stringify(docs,undefined,2));
	// },(err)=>{
	// 	console.log('Unable to fetch todos ',err);
	// });

	db.collection('Users').find({age: 22}).toArray().then((doc)=>{
		console.log('Users: ');
		console.log(JSON.stringify(doc, undefined,2));
	},(err)=>{
		console.log('Unable to fetch todos ',err);
	});

	db.close();
} );

