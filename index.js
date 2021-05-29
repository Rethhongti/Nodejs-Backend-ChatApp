const { json } = require('express');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const mongoose = require('mongoose');

const user = require('./route/user');

const mongoURL = 'mongodb+srv://Fanjo:fanjo123@cluster0.ndvk0.mongodb.net/ChatApp?retryWrites=true&w=majority';
//const mongoURL = 'mongodb://localhost:27017/ChatApp';

mongoose.connect(mongoURL, {useNewUrlParser: true,useUnifiedTopology:true})
.then((result)=>{console.log("Mongo DB Connected")})
.catch((err)=>{console.log(err)});

app.use('/images',express.static('images'));
app.use(express.json());
app.use('/user',user);

app.get('/',(req,res)=>{
    res.send("Flutter Socket");
});

var onlineUsers = [];
io.on('connection',function(socket){

    console.log("User Connected");

    socket.on('chatID',function(data){
        socket.join(data['_id']);

        onlineUsers.push(data['_id']);

        socket.broadcast.emit('onlineUsers', {
            'users': onlineUsers
        });

        socket.on("send_message",(msg)=>{
            socket.in(msg["receiverID"]).emit("receive_msg",msg);
            console.log(msg["msg"]);
        });

        socket.on('writting',function(data){
            socket.broadcast.emit('writting',data);
        });

        socket.on('StopWriting',function(data){
            socket.broadcast.emit('StopWriting',data);
        });
    });

    socket.on('disconnect',function(){
        console.log("User Disconnected");
    });
});


http.listen(3000,"0.0.0.0",function(){
    console.log("Port 3000 is listening...");
});