const expect = require('expect');
const request = require('supertest');
const {ObjectID}= require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {User} = require('./../models/user.js');
const {todos, populateTodos,users,populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('DELETE /todos/:id',()=>{
	it('should delete the record',(done)=>{

		var hexId = todos[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo._id).toBe(hexId);
			})
			.end((err,res)=>{
				if(err){
					return done(err);
				}
				
				Todo.findById(hexId).then((doc)=>{
					expect(doc).toNotExist();
					done();
				}).catch((e)=>done(e));

			});
	})

	it('should return 404 if todos not found',(done)=>{
		request(app)
			.delete(`/todos/585e0a4c98851203daa871de`)
			.expect(404)
			.end(done);

	})

	it('should return 404 if objectID is invalid',(done)=>{
		request(app)
			.delete('/todos/123')
			.expect(404)
			.end(done);
			
	})
})

describe('PATCH /todos/:id',()=>{
	it('should update the data',(done)=>{
		var id = todos[1]._id.toHexString();
		var text = 'Test case!';
		var completed = true;

		request(app)
			.patch(`/todos/${id}`)
			.send({text,completed})
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(true);
				expect(res.body.todo.completedAt).toBeA('number');
			})
			.end(done);
	})

	it('should clear completeAt when todo is not completed',(done)=>{
		var id = todos[1]._id.toHexString();
		var text = 'Test case!';
		var completed = false;

		request(app)
			.patch(`/todos/${id}`)
			.send({text,completed})
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toNotExist();
			})
			.end(done);
	})
})

describe('GET /users/me',()=>{
	it('should return users if authenticated',(done)=>{
		request(app)
			.get('/users/me')
			.set('x-auth',users[0].tokens[0].token)
			.expect(200)
			.expect((res)=>{
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);
	});

	it('should return 401 if unauthenticated',(done)=>{
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res)=>{
				expect(res.body).toEqual({});
			})
			.end(done);
	})
});

describe('POST /users',()=>{
	it('should create a user',(done)=>{
		var email = 'kitsada280@gmail.com';
		var password = 'Krittin31431';
		request(app)
			.post('/users')
			.send({email,password})
			.expect(200)
			.expect((res)=>{
				expect(res.headers['x-auth']).toExist();
				expect(res.body._id).toExist();
				expect(res.body.email).toBe(email);
			})
			.end((err)=>{
				if(err){
					done(err);
				}

				User.findOne({email}).then((user)=>{
					expect(user).toExist();
					expect(user.password).toNotBe(password);
				})
				done();
			});
	});

	it('should return validation error if request invalid',(done)=>{
		var email = 'dfghjkl@chgj';
		var password = '123';

		request(app)
			.post('/users')
			.send({email,password})
			.expect(400)
			.end((error)=>{
				if(error){
					return done(error);
				}

				User.findOne({email}).then((user)=>{
					expect(user).toNotExist();
				})
				done();
			})
	});

	it('should not create user if email in use',(done)=>{
		var email = 'krittin@example.com';
		var password = '12345678';

		request(app)
			.post('/users')
			.send({email,password})
			.expect(400)
			.end(done);
		})
})

describe('POST /users/login', ()=>{
	it('should login users and return auth token',(done)=>{
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password
			})
			.expect(200)
			.expect((res)=>{
				expect(res.headers['x-auth']).toExist();
			})
			.end((err,res)=>{
				if(err){
					return done(err);
				}

				User.findById(users[1]._id).then((user)=>{
					expect(user.tokens[0]).toInclude({
						access: 'auth',
						token: res.headers['x-auth']
					})
					done();
				}).catch((e)=>done(e));
			});
	});

	it('should reject invalid login',(done)=>{
		request(app)
			.post('/users/login')
			.send({
				email: '1234@dfgh.df',
				password: '123456789'
			})
			.expect(400)
			.expect((res)=>{
				expect(res.headers['x-auth']).toNotExist();
			})
			.end(done);
	});
})

describe('DELETE /users/me/token',()=>{
	it('should remove auth token on logout',(done)=>{
		request(app)
			.delete('/users/me/token')
			.set('x-auth',users[0].tokens[0].token)
			.expect(200)
			.end((err,res)=>{
				if(err){
					return done(err);
				}
				User.findById(users[0]._id).then((user)=>{
					expect(user.tokens.length).toBe(0);
					done()
				},(e)=>{
					done(e);
				})
			});
	});



})