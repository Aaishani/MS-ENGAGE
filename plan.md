# Plan of Action

- Intialise our NodeJS Project
- Initialise our first view
- Create a room id
- Add the ability to view our own video
- Add ability to allow others to stream their video
- Add styling
- Add the ability to create messages
- Add mute button
- Add stop video button


-> ctr + C to quit out of nodemon

-> ejs - embedded javascript helps get variables from the backend to the front end
using room.ejs and   res.render('room')  shows whatever is in the front end ie room on the website

->install nodemon once then use nodemon server.js to run everytime

->save after everything in each file to show changes on website

- uuid gives randome ids so for uniquie room ids its used

- res.redirect('/${uuidv4()}'); will => 
//instead of rendering the root URL, when we get to localhost 3030 it will automatically generate an uuid and redirect you to it.
- uuidv4() is the function, before that is the string literals

- app.get will get that uuid that the uuidv4() function generated
- in res.render('room',{ roomId: req.params.room}) we are passing Room Id to the Front end
- pass roomId in room.ejs  using console.log("<%=roomId %>");
ie now te room Id is visible in inspect=> cosole ie the room id is passed from the nodejs server to the front end using ejs

- sockets is for realtime communicaton, channel for 2 people communicating
Its a library

- joined room in terminal shows that socket io is working and i have joined the room

- WebRTC allows realtime communication between web browsers

-PeerJS wraps the browsers webRTC implementation to provide a complete easy to use peer to peer connection
- follow the step in peerjs website