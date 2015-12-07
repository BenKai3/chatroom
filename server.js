var express = require("express");
var path = require("path");
// create the express app
var app = express();

var members = [];
var conversation = [{ name: 'jorge', text: 'hey hey hey, i like chatting'},{name: 'henry', text: 'oh man, what a coincidence, I like chatting too'},{name: 'j4ne', text: 'Im Jane.'}];

function createMemberId(){
	return Math.random();
}


// static content 
app.use(express.static(path.join(__dirname, "./static")));

// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');


// ROUTES
app.get('/', function(request, response) {
  response.render('index', {});
});

var server = app.listen(8000, function() {
  console.log("listening on port 8000");
});

// this gets the socket.io module
var io = require('socket.io').listen(server);  // notice we pass the server object

// Whenever a connection event happens (the connection event is built in) run the following code
io.sockets.on('connection', function (socket) {
	console.log('ON CONNECT, socket.id: '+socket.id);
	socket.on("new_member", function (data){
		var member = {};
		member.name = data.name;
		member.id = createMemberId();
		members.push(member);
		io.emit("added_member",{member: member, members: members, conversation: conversation });
	});
	socket.on('remove_member', function(data){
		for (var i = 0; i < members.length; i++) {
			if (members[i]['name'] == data.name && members[i]['id'] == data.id) {
				members.splice(i,1);
			};
		};
		io.emit('removed_member', { name: data.name, id: data.id });
	});

});