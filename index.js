const { json } = require('express');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');

app.get('/',(req,res)=>{
    res.send("Flutter Socket");
});

var onlineUsers = [];
io.on('connection',function(socket){

    console.log("User Connected");

    socket.on('chatID',function(data){
        socket.join(data['id']);

        onlineUsers.push(data['id']);

        socket.broadcast.emit('onlineUsers', {
            'users': onlineUsers
        });

        socket.on("send_message",(msg)=>{
            socket.in(msg["receiverID"]).emit("receive_msg",msg["msg"]);
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