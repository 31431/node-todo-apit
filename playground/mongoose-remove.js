const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result)=>{
// 	console.log(result);
// });

Todo.findByIdAndRemove('585d48ae15a3067eb23bbaf5').then((result)=>{
	console.log('Removed data is ',result);
})