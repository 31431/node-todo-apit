const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '585a950ecd170a031b0567291';

// console.log(ObjectID.isValid(id));

// Todo.find({
// 	_id: id
// }).then((todos)=>{
// 	console.log('Todos', todos);
// })

// Todo.findOne({
// 	_id: id
// }).then((todo)=>{
// 	if(!todo){
// 		return console.log('ID not found!');
// 	}
// 	console.log('Todo', todo);
// })

// Todo.findById(id).then((todo)=>{
// 	if(!todo){
// 		return console.log('ID not found!');
// 	}
// 	console.log('TodoByID ',todo);
// }).catch((e)=>{
// 	console.log(e);
// })

ID = '5858f8b416c272095be51194';
User.findById(ID).then((user)=>{
	if(!user){
		return console.log('No user found');
	}
	console.log('User: ', user);
}).catch((e)=>{
	console.log('ERROR! ', e);
});

