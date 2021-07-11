const express = require('express');
const app = express();                           // Initialising express application. (framework of node.js)
const server = require('http').Server(app);      // Server that's going to run (inside const express)

//import socket here
const io = require('socket.io')(server)           //specify the server


//import 'v4' version of the uuid library in server
const {v4: uuidv4} = require('uuid');


//run the peerJS server
const { ExpressPeerServer } = require ('peer');
const peerServer = ExpressPeerServer(server, {
    debug:true
});



app.use('/peerjs', peerServer);                  //specify to the peer server what url to be used, ie Url is '/peerjs'

app.set('view engine', 'ejs');                   // view engine is ejs

app.use(express.static('public'));              // set the public url for the script file ie all public files are going to be here





app.get('/login',(req, res) =>{                       // create the first url - the / url

    res.redirect(`/${uuidv4()}`);                     // function that now shows whatever is in the front end ie room on the website - res.render
                                                 
})

app.get('/:room',(req,res) =>{                                                  // To get a new URL, room is a parameter
    
    res.render('room',{ roomId: req.params.room})                               // This roomId passed in render is used later in socket
})


io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {                                   // the call takes place in a room
        socket.join(roomId);                                                       // join room with room id
        socket.to(roomId).emit('user-connected', userId);                          //tells everyone that user has connected
       
        socket.on('message', (message) => {
            //send message to the same room
            io.to(roomId).emit('createMessage', message)
        }); 

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)

        })

    })


})



server.listen(process.env.PORT||3030);                            // server is going to be local host and port is 3030