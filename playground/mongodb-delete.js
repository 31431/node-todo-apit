const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (error,db)=>{
	if(error){
		return console.log('Unable to connect to mongodb');
	};
	console.log('Connected successfully to db');

	// db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result)=>{
	// 	console.log(result);
	// });

	// db.collection('Todos').deleteOne({text: 'Eat Lunch'}).then((result)=>{
	// 	console.log(result);
	//})

	// db.collection('Todos').findOneAndDelete({completed: false}).then((result)=>{
	// 	console.log(result);
	// })

	db.collection('Users').findOneAndDelete({_id: ObjectID('58561a745d6ecf03404c53d9')}).then((result)=>{
		console.log(result);
	})



})