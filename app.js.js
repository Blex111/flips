var express = require('express');
var app = express();
var serv = require('http').Server(app);
 var path = require('path')
 var url = require('url')
 
app.get('/',function(req,res){
	res.sendFile(__dirname + '/client/index.html');
});
//app.use('/client',express.static(__dirname + '/client'));
app.use(express.static(path.join(__dirname, '/client')));
serv.listen(80);
	
console.log("server started")

var SOCKET_LIST = {};
var messages = "";
var names = [];
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;
	
	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id];
		
	});
	socket.on('name',function(data){
		names[socket.id] = data.message;

	});
	socket.on('msend',function(data){
		if(names[socket.id] === ""||names[socket.id] === undefined ){
		messages += socket.id+": "+data.message+"<br>"
		}else{
		messages += names[socket.id]+": "+data.message+"<br>"	
			
		}
		
	});
	
	
	
});	

setInterval(function(){

	
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];

		socket.emit('mess',messages);
	}
},1000/25);