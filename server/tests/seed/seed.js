const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
	_id: userOneId,
	email: 'krittin@example.com',
	password: 'userOnePass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'},'abc123').toString()
	}]
},{
	_id: userTwoId,
	email: 'jen@example.com',
	password:'userTwoPass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userTwoId, access: 'auth'},'abc123').toString()
	}]
}]

const todos =[{
	_id: new ObjectID(),
	text: 'First Test Todo',
	_creator: userOneId
},{
	_id: new ObjectID(),
	text: 'Second Test Todo',
	completed: true,
	comepetedAt: 1234567,
	_creator: userTwoId
}];

const populateTodos  = (done)=>{
	Todo.remove({}).then(()=>{
		return Todo.insertMany(todos);
	}).then(()=> done());
};

const populateUsers = (done)=>{
	User.remove({}).then(()=>{
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();

		return Promise.all([userOne,userTwo])
	}).then(()=>done());
}

module.exports = {todos,users,populateTodos,populateUsers};