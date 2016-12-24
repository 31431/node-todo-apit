require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo.js');
const {User} = require('./models/user.js');

var app = new express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc)=>{
		res.send(doc);
		res.send()
	},(e)=>{
		res.status(400).send(e);
	})
})

app.get('/todos',(req,res)=>{
	Todo.find().then((todos)=>{
		res.send({todos});
	},(e)=>{
		res.status(400).send(e);
	});
});

app.get('/todos/:id',(req,res)=>{
	var id = req.params.id;


	if(!ObjectID.isValid(id)){
		return res.status(404).send();
	};

	Todo.findById(id).then((todo)=>{
		if(!todo){
			return res.status(404).send();
		}
		res.status(200).send({todo});
	}).catch((e)=>{
		res.status(400).send();
	});
});

app.delete('/todos/:id',(req,res)=>{
	var id = req.params.id;

	if(!ObjectID.isValid(id)){
		return res.status(404).send();
	}
	Todo.findByIdAndRemove(id).then((todo)=>{
		if(!todo){
			return res.status(404).send();
		}
		res.status(200).send({todo});
	}).catch((e)=>{
		res.status(404).send();
	})
});

app.patch('/todos/:id', (req,res)=>{
	var id = req.params.id;
	var body = _.pick(req.body, ['text','completed']);

	if(!ObjectID.isValid(id)){
		return res.status(404).send();
	}

	if(_.isBoolean(body.completed) && body.completed){
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findByIdAndUpdate(id,{$set:body},{new: true}).then((todo)=>{
		if(!todo){
			return res.status(404).send();
		}
		res.send({todo});

	}).catch((e)=>{
		res.status(400).send();
	})
})

app.listen(port,()=>{
	console.log('Started on Port ',port);
});


module.exports = {app};