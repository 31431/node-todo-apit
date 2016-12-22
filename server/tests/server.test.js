const expect = require('expect');
const request = require('supertest');
const {ObjectID}= require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {User} = require('./../models/user.js');

const todos =[{
	_id: new ObjectID(),
	text: 'First Test Todo'
},{
	_id: new ObjectID(),
	text: 'Second Test Todo'
}];

beforeEach((done)=>{
	Todo.remove({}).then(()=>{
		return Todo.insertMany(todos);
	}).then(()=> done());
})

describe('POST /todos',()=>{
	it('should create a new todos',(done)=>{
		var text = 'Hey there!';

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res)=>{
				expect(res.body.text).toBe(text);
			})
			.end((err,res)=>{
				if(err){
					return done(err);
				}

				Todo.find({text}).then((todos)=>{
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e)=>{ done(e);})
			})
	});

	it('should not create todos with invalid body data',(done)=>{
		request(app)
			.post('/todos')
			.send({text: ''})
			.expect(400)
			.end((err,res)=>{
				if(err){
					return done(err);
				}

				Todo.find().then((todos)=>{
					expect(todos.length).toBe(2);
					done();
				}).catch((e)=>{done(e);})
			})
	})
});


describe('GET Request',()=>{
	it('should get all todos',(done)=>{
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res)=>{
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	})
})

describe('GET /todos/:id',()=>{
	it('should get 404 due to invalid id',(done)=>{
		request(app)
			.get('/todos/123')
			.expect(404)
			.end(done);
	})

	it('should return todo doc',(done)=>{
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	})

	it('should return empty todo doc',(done)=>{
		request(app)
			.get('/todos/685a950ecd170a031b05672a')
			.expect(404)
			.expect((res)=>{
				expect(res.body.todo).toBe(undefined);
			})
			.end(done);
	})
})